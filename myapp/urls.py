from django.contrib.auth.views import LogoutView
from django.urls import path
from . import views

urlpatterns = [
    path('', views.start, name='start'),
    path('index/', views.index, name='index'),
    path('index/about/', views.about, name='about'),
    path('index/contact/', views.contact, name='contact'),
    path('index/user_profile/', views.user_profile, name='user_profile'),
    path('login/', views.user_login, name='login'),
    path('signup/', views.user_signup, name='signup'),
    path('index/LogIn-SignUp/', views.LogInAndSignUp, name='LogIn-SignUp'),
    path('header', views.header, name='header'),
    path('index/search', views.search, name='search'),
    path('index/cart/', views.cart_view, name='cart'),
    path('index/brand/<str:brand_name>/', views.brand_view, name='brand'),
    path('index/product', views.product, name='product'),
    path('load/<str:page_name>/', views.load_partial, name='load_partial'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('api/products/', views.get_products, name='get_products'),
    path('payment/', views.confirm_payment, name='confirm_payment'),
    path('order_history/', views.order_history, name='order_history'),
    path('checkout/', views.checkout, name='checkout'),
    path('add_to_cart/', views.add_to_cart, name='add_to_cart'),
    path('get_cart/', views.get_cart, name='get_cart'),
    path('remove_from_cart/<int:product_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('update_quantity/', views.update_quantity, name='update_quantity'),

]