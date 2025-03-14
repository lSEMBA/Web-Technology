from django import forms
from .models import Profile

# ProfileForm for editing user profile
class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['avatar', 'bio', 'phone', 'address']

# OrderForm for placing orders
class OrderForm(forms.Form):
    product = forms.CharField(max_length=255, widget=forms.TextInput(attrs={'class': 'form-control'}))
    quantity = forms.IntegerField(min_value=1, widget=forms.NumberInput(attrs={'class': 'form-control'}))
