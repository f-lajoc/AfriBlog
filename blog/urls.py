from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_view, name='index'),
    path('post/write/', views.PostCreateView.as_view(), name='post_create'),
    path('post/<slug:slug>/', views.detail_view, name='detail'),
    path('post/<slug:slug>/edit/', views.PostUpdateView.as_view(), name='post_update'),
    path('post/<slug:slug>/delete/', views.PostDeleteView.as_view(), name='post_delete'),
    path('category/<slug:slug>/', views.category_view, name='category'),
    path('author/<str:username>/', views.author_profile, name='profile'),
    path('drafts/', views.drafts_view, name='drafts'),           # new
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]