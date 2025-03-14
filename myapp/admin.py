from django.contrib import admin
from .models import Product

try:
    # Unregister the Product model if it's already registered
    admin.site.unregister(Product)
except admin.sites.NotRegistered:
    pass

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Fields to display in the admin list view
    list_display = ('name', 'brand', 'price', 'category', 'features', 'model3D')  # Include model3D

    # Optional: Add search and filter capabilities for better usability
    search_fields = ('name', 'brand', 'category')
    list_filter = ('category', 'brand')

# Customize the admin site headers
admin.site.site_header = "ElectroMart Admin Panel"
admin.site.site_title = "ElectroMart Admin"
admin.site.index_title = "Welcome to the ElectroMart Management System"
