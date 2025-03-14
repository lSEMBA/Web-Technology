from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponseRedirect, HttpResponseNotFound
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

from django.contrib import messages

from .models import Profile, Product, Cart, PurchaseHistory, CartItem, Purchase, Order
from .forms import ProfileForm

import logging
import json
def start(request):
    return render(request, 'start.html')

def index(request):
    return render(request, 'index.html')

def header(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    return render(header, 'header.html', {'profile': profile})
    
def about(request):
    return render(request, 'about.html')

def user_profile(request):
    return render(request, 'user_profile.html')

def contact(request):
    return render(request, 'contact.html')
from django.shortcuts import render

def LogInAndSignUp(request):
    return render(request, 'LogIn-SignUp.html')

def cart_view(request):
    return render(request, 'cart.html')

def brand_view(request, brand_name):
    context = {'brand_name': brand_name}
    return render(request, 'brand.html', context)\




def search(request):
    query = request.GET.get('query')
    context = {}
    if query:
        return render(request, 'search.html', context)
    else:
        return HttpResponseRedirect('/index/')

    
def product(request):
    id = request.GET.get('id')
    context = {}
    if id:
        return render(request, 'product.html', context)
    else:
        return HttpResponseRedirect('/index/')

def load_partial(request, page_name):
    try:
        return render(request, f'{page_name}.html')
    except Exception:
        return HttpResponseNotFound('<p>Page not found</p>')

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('/index')
        else:
            messages.error(request, 'Incorrect username or password.')
            return redirect('/index/LogIn-SignUp')

    return render(request, 'LogIn-SignUp.html')





# Sign-Up View
logger = logging.getLogger(__name__)

def user_signup(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        logger.info(f"Received signup request: username={username}, email={email}")

        if User.objects.filter(username=username).exists():
             messages.error(request, 'Username already exists')
             return redirect('signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already exists')
            return redirect('signup')

        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        login(request, user)
        return redirect('index') 
    return render(request, 'LogIn-SignUp.html')

@login_required
def user_profile(request):
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('user_profile')
    else:
        form = ProfileForm(instance=profile)

    return render(request, 'user_profile.html', {'profile': profile, 'form': form})


@csrf_exempt
@login_required
def add_to_cart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product = data.get('product')
            
            if not product:
                return JsonResponse({'status': 'error', 'message': 'No product data provided'}, status=400)
            
            # ???? ?? ?? ??? image ?????
            if 'image' not in product:
                return JsonResponse({'status': 'error', 'message': 'Image URL is missing'}, status=400)
            
            cart_item, created = Cart.objects.get_or_create(
                user=request.user,
                product_id=product['id'],
                defaults={
                    'product_name': product['name'],
                    'product_price': product['price'],
                    'quantity': product.get('quantity', 1),
                    'product_image': product['image']  # ???? ?? ???? ??? ?????
                }
            )
            
            if not created:
                cart_item.quantity += product.get('quantity', 1)
                cart_item.save()
            
            return JsonResponse({'status': 'success', 'message': 'Item added to cart!'})
        
        except Exception as e:
            print("Error in add_to_cart:", str(e))
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@login_required
def get_cart(request):
    cart_items = Cart.objects.filter(user=request.user)
    cart = [{
        'id': item.product_id,
        'name': item.product_name,
        'price': str(item.product_price),
        'quantity': item.quantity,
        'image': item.product_image 
    } for item in cart_items]
    
    return JsonResponse({'cart': cart})

@csrf_exempt
def remove_from_cart(request, product_id):
    if request.method == 'DELETE':
        try:
            # ????? ?? ?????? ?? ????? ???????? product_id
            cart_item = Cart.objects.get(product_id=product_id, user=request.user)
            cart_item.delete()
            return JsonResponse({'status': 'success'})
        except Cart.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Item not found'}, status=404)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

@csrf_exempt
@login_required
def update_quantity(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            new_quantity = data.get('quantity')
            
            if not product_id or not new_quantity:
                return JsonResponse({'status': 'error', 'message': 'Product ID or quantity is missing'}, status=400)
            
            cart_item = Cart.objects.filter(user=request.user, product_id=product_id).first()
            if not cart_item:
                return JsonResponse({'status': 'error', 'message': 'Product not found in cart'}, status=404)
            
            cart_item.quantity = new_quantity
            cart_item.save()
            
            return JsonResponse({'status': 'success', 'message': 'Quantity updated successfully'})
        
        except Exception as e:
            print("Error in update_quantity:", str(e))
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    # ?????? ????? GET? ???? ?? ????? ????? ?? ???? ?????? ??? ??????
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
def get_products(request):
    try:
        products = Product.objects.all()
        product_list = [
            {
                "id": product.id,
                "image": product.image.url if product.image else None,  # Safely access image
                "name": product.name,
                "description": product.description,
                "brand": product.brand,
                "price": float(product.price),  # Convert price to float for JSON compatibility
                "category": product.category,
                "features": product.features.split(",") if product.features else [],  # Split features into a list
                "model3D": product.model3D.url if product.model3D else None,  # Safely include model3D
            }
            for product in products
        ]
        return JsonResponse({"products": product_list}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def payment_page(request):
    cart_items = Cart.objects.filter(user=request.user)
    total_price = sum(item.product.price * item.quantity for item in cart_items)
    return render(request, 'payment.html', {'cart_items': cart_items, 'total_price': total_price})

@login_required
def confirm_payment(request):
    cart_items = CartItem.objects.filter(user=request.user)
    if request.method == "POST":
        # Logic to move cart items to purchase history
        for item in cart_items:
            PurchaseHistory.objects.create(
                user=request.user,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price * item.quantity
            )
        # Clear cart items after payment
        cart_items.delete()
        return redirect('purchase_history')
    
    total_price = sum(item.product.price * item.quantity for item in cart_items)
    return render(request, 'payment.html', {'cart_items': cart_items, 'total_price': total_price})

@login_required
def order_history(request):
    history = PurchaseHistory.objects.filter(user=request.user).order_by('-purchased_at')
    return render(request, 'H.html', {'history': history})

from .models import CartItem, Purchase

@login_required
def checkout(request):
    if request.method == 'POST':
        cart_items = Cart.objects.filter(user=request.user)
        for item in cart_items:
            Order.objects.create(
                user=request.user,
                product=item.product,
                quantity=item.quantity,
                total_price=item.product.price * item.quantity,
                status='Received'
            )
            item.delete()  # Remove item from cart after moving to order history
        return redirect('order_history')
    return render(request, 'checkout.html')
