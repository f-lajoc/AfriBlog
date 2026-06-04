
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.core.paginator import Paginator
from django.db.models import Q
from django.urls import reverse_lazy
from .models import Post, Category, Comment

def index_view(request):
    search_query = request.GET.get('search', '')
    posts_list = Post.objects.filter(status='published')
    
    if search_query:
        posts_list = posts_list.filter(
            Q(title__icontains=search_query) | Q(body__icontains=search_query)
        )
    
    featured_post = Post.objects.filter(status='published', featured=True).first()
    
    paginator = Paginator(posts_list, 6) # 6 posts per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    categories = Category.objects.all()
    
    context = {
        'page_obj': page_obj,
        'featured_post': featured_post,
        'categories': categories,
        'search_query': search_query
    }
    return render(request, 'blog/index.html', context)

def detail_view(request, slug):
    post = get_object_or_404(Post, slug=slug, status='published')
    comments = post.comments.filter(approved=True)
    categories = Category.objects.all()
    related_posts = Post.objects.filter(category=post.category, status='published').exclude(id=post.id)[:3]
    
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        body = request.POST.get('body')
        if name and email and body:
            Comment.objects.create(post=post, name=name, email=email, body=body)
            return redirect('detail', slug=post.slug)

    return render(request, 'blog/detail.html', {
        'post': post,
        'comments': comments,
        'categories': categories,
        'related_posts': related_posts
    })

def category_view(request, slug):
    category = get_object_or_404(Category, slug=slug)
    posts = Post.objects.filter(category=category, status='published')
    return render(request, 'blog/category.html', {'category': category, 'posts': posts})

def author_profile(request, username):
    posts = Post.objects.filter(author__username=username)
    return render(request, 'blog/profile.html', {'author_username': username, 'posts': posts})

# Authentication Views
def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'blog/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('index')
    else:
        form = AuthenticationForm()
    return render(request, 'blog/login.html', {'form': form})

def logout_view(request):
    if request.method == 'POST' or request.method == 'GET':
        logout(request)
        return redirect('index')

# Author CRUD Operations
class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    fields = ['title', 'body', 'category', 'status', 'featured']
    template_name = 'blog/form.html'
    success_url = reverse_lazy('index')

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class PostUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Post
    fields = ['title', 'body', 'category', 'status', 'featured']
    template_name = 'blog/form.html'
    success_url = reverse_lazy('index')

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author

class PostDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Post
    template_name = 'blog/post_confirm_delete.html'
    success_url = reverse_lazy('index')

    def test_func(self):
        post = self.get_object()
        return self.request.user == post.author