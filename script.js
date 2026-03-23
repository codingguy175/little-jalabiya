document.addEventListener('DOMContentLoaded', () => {
    
    // Global Cart State
    let cart = [];
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // we changed this to always have bg but for hero section we want transparent
            // Let's implement real transition
            if(window.scrollY > 50) {
                 navbar.classList.add('scrolled');
            } else {
                 navbar.classList.remove('scrolled');
            }
        }
    });

    // Fix initial state just in case
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.classList.remove('ri-menu-4-line');
            icon.classList.add('ri-close-line');
            navbar.classList.add('scrolled'); // Force solid background when menu open
        } else {
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-4-line');
            if (window.scrollY <= 50) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Close mobile menu on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-4-line');
        });
    });

    // Intersection Observer for scroll animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                animationObserver.unobserve(entry.target); // Run once
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px" // Slightly before it fully enters viewport
    });

    const animatedElements = document.querySelectorAll('.fade-in, .fade-up, .fade-left, .fade-right');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // Hero elements immediate animation
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-in');
        heroElements.forEach(el => {
            el.classList.add('appear');
        });
    }, 100);

    // Global Background Slider
    const bgSlides = document.querySelectorAll('.bg-slide');
    if (bgSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            bgSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % bgSlides.length;
            bgSlides[currentSlide].classList.add('active');
        }, 5000); // Change image every 5 seconds
    }

    // Login Modal
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const modalClose = document.getElementById('modal-close');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // prevent scrolling
        });

        modalClose.addEventListener('click', () => {
            loginModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Search Functionality
    const searchBtn = document.querySelector('.icon-btn[aria-label="Search"]');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Gather all products dynamically
    const products = [];
    document.querySelectorAll('.product-card').forEach(card => {
        const titleEl = card.querySelector('h4');
        const priceEl = card.querySelector('.price') || card.querySelector('span'); // fallback
        const imgEl = card.querySelector('img');
        
        if (titleEl && priceEl) {
            products.push({
                title: titleEl.textContent,
                price: priceEl.textContent,
                imgSrc: imgEl ? imgEl.src : '',
                element: card
            });
        }
    });

    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.classList.add('active');
            setTimeout(() => searchInput.focus(), 100);
            document.body.style.overflow = 'hidden';
            renderResults(''); // clear on open
        });

        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        searchInput.addEventListener('input', (e) => {
            renderResults(e.target.value.toLowerCase().trim());
        });
    }

    function renderResults(query) {
        searchResults.innerHTML = '';
        if (!query) return;

        const filtered = products.filter(p => p.title.toLowerCase().includes(query));
        
        if (filtered.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No products found matching your search.</p>';
            return;
        }

        filtered.forEach(p => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                ${p.imgSrc ? `<img src="${p.imgSrc}" alt="${p.title}">` : '<div class="no-img"></div>'}
                <div class="result-info">
                    <h4>${p.title}</h4>
                    <span>${p.price}</span>
                </div>
            `;
            
            resultItem.addEventListener('click', () => {
                searchModal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Scroll to the product
                p.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Highlight momentarily
                const originalShadow = p.element.style.boxShadow;
                p.element.style.transition = 'box-shadow 0.4s';
                p.element.style.boxShadow = '0 0 0 4px var(--color-primary)';
                setTimeout(() => {
                    p.element.style.boxShadow = originalShadow;
                }, 2000);
            });
            
            searchResults.appendChild(resultItem);
        });
    }

    // Product Quick View Modal Logic
    window.openProductModal = function(cardElement) {
        const modal = document.getElementById('product-modal');
        if (!modal) return;
        
        // Parse data attributes
        const title = cardElement.getAttribute('data-title') || 'Product';
        const price = cardElement.getAttribute('data-price') || '';
        const colorsData = cardElement.getAttribute('data-colors') || ''; 
        const sizesData = cardElement.getAttribute('data-sizes') || ''; 
        const imagesData = cardElement.getAttribute('data-images');
        let imgSrc = '';

        if(imagesData) {
            imgSrc = imagesData.split(',')[0];
        } else {
            const imgEl = cardElement.querySelector('img');
            imgSrc = imgEl ? imgEl.src : '';
        }

        // Set Image
        const modalImg = document.getElementById('modal-img');
        const noImg = document.getElementById('modal-no-img');
        if (imgSrc) {
            modalImg.src = imgSrc;
            modalImg.style.display = 'block';
            noImg.style.display = 'none';
        } else {
            modalImg.style.display = 'none';
            noImg.style.display = 'flex';
        }

        // Set text
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-price').textContent = price;

        // Set colors
        const colorsContainer = document.getElementById('modal-colors');
        colorsContainer.innerHTML = '';
        if (colorsData) {
            const colors = colorsData.split(',');
            colors.forEach((c, index) => {
                const [name, hex] = c.split(':');
                const div = document.createElement('div');
                div.className = 'color-option' + (index === 0 ? ' selected' : '');
                div.innerHTML = `<span class="color-circle" style="background-color: ${hex}; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);"></span><span>${name}</span>`;
                div.onclick = () => {
                    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
                    div.classList.add('selected');
                };
                colorsContainer.appendChild(div);
            });
        }

        // Set sizes
        const sizeSelect = document.getElementById('modal-size-select');
        sizeSelect.innerHTML = '';
        if (sizesData) {
            const sizes = sizesData.split(',');
            sizes.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s;
                opt.textContent = s;
                sizeSelect.appendChild(opt);
            });
        }

        // Add To Order button
        const btnOrder = document.getElementById('btn-add-order');
        btnOrder.onclick = () => {
            const selectedColorSpan = colorsContainer.querySelector('.color-option.selected span:last-child');
            const color = selectedColorSpan ? selectedColorSpan.textContent : 'Default';
            const size = sizeSelect.value;
            
            // Add to persistent cart
            cart.push({
                title: title,
                price: price,
                color: color,
                size: size
            });

            // Update cart badge
            updateCartBadge();

            // Open Checkout Modal with all items
            openCheckoutModal();
        };

        // Open Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Listen to close explicitly on product modal
    document.getElementById('product-close')?.addEventListener('click', () => {
        document.getElementById('product-modal').classList.remove('active');
        document.body.style.overflow = '';
    });
    document.getElementById('product-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'product-modal') {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Inline Card Carousel Logic
    function goToSlide(wrapper, dir) {
        const imgs = wrapper.querySelectorAll('.carousel-img');
        const dots = wrapper.querySelectorAll('.dot');
        let activeIdx = 0;
        imgs.forEach((img, i) => {
            if(img.classList.contains('active')) activeIdx = i;
            img.classList.remove('active');
            if(dots[i]) dots[i].classList.remove('active');
        });
        let nextIdx = activeIdx + dir;
        if(nextIdx >= imgs.length) nextIdx = 0;
        if(nextIdx < 0) nextIdx = imgs.length - 1;

        imgs[nextIdx].classList.add('active');
        if(dots[nextIdx]) dots[nextIdx].classList.add('active');
    }

    window.slideCarousel = function(btn, dir) {
        const wrapper = btn.closest('.card-carousel');
        goToSlide(wrapper, dir);
    };

    // Touch / swipe support for all carousels
    document.querySelectorAll('.card-carousel').forEach(carousel => {
        let touchStartX = 0;
        let touchStartY = 0;

        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        carousel.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            // Only register horizontal swipe (must be bigger than vertical movement)
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                goToSlide(carousel, dx < 0 ? 1 : -1);
            }
        }, { passive: true });
    });

    // --- Cart & Checkout Implementation ---
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutClose = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummarySmall = document.getElementById('order-summary-small');
    const cartBtn = document.getElementById('cart-btn');

    function updateCartBadge() {
        const cartBadge = document.querySelector('.cart-badge');
        if(cartBadge) {
            cartBadge.innerText = cart.length;
        }
    }

    if(cartBtn) {
        cartBtn.onclick = (e) => {
            e.preventDefault();
            if(cart.length === 0) {
                alert("Your cart is empty. Please choose some articles first!");
                return;
            }
            openCheckoutModal();
        };
    }

    window.openCheckoutModal = function() {
        if(cart.length === 0) return;

        // Build summary for all items in cart
        let summaryHTML = `<div style="max-height: 200px; overflow-y: auto; margin-bottom: 1rem; border-bottom: 1px solid #eee;">`;
        let totalVal = 0;
        
        cart.forEach((item, index) => {
            summaryHTML += `
                <div style="margin-bottom: 0.8rem; padding-bottom: 0.5rem; ${index < cart.length - 1 ? 'border-bottom: 1px dashed #eee;' : ''}">
                    <div style="display:flex; justify-content:space-between; align-items: flex-start;">
                        <h4 style="margin:0; font-size: 0.95rem; color:var(--text-main);">${item.title}</h4>
                        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ff4444; cursor:pointer; font-size: 0.8rem;">Remove</button>
                    </div>
                    <p style="margin: 0.2rem 0; font-weight: 600; color: var(--color-primary);">${item.price}</p>
                    <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: #666;">
                        <span>Color: ${item.color}</span>
                        <span>Size: ${item.size}</span>
                    </div>
                </div>
            `;
            // Optional: total calculation if price is numeric. For now, it's string "2800.00 DA"
        });
        summaryHTML += `</div>`;
        
        orderSummarySmall.innerHTML = summaryHTML;
        
        // Hide product modal if open
        const productModal = document.getElementById('product-modal');
        if(productModal) productModal.classList.remove('active');
        
        // Open checkout modal
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartBadge();
        if(cart.length === 0) {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            openCheckoutModal(); // Refresh summary
        }
    };

    window.closeCheckoutModal = function() {
        const modal = document.getElementById('checkout-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset modal state for next time
            setTimeout(() => {
                document.getElementById('checkout-form-container').style.display = 'block';
                document.getElementById('order-success-container').style.display = 'none';
                if(checkoutForm) checkoutForm.reset();
            }, 500);
        }
    };

    if(checkoutClose) {
        checkoutClose.onclick = () => {
            closeCheckoutModal();
        };
    }

    if(checkoutModal) {
        checkoutModal.onclick = (e) => {
            if(e.target === checkoutModal) {
                closeCheckoutModal();
            }
        };
    }

    if(checkoutForm) {
        checkoutForm.onsubmit = (e) => {
            e.preventDefault();
            
            // Hide form and show success message
            document.getElementById('checkout-form-container').style.display = 'none';
            document.getElementById('order-success-container').style.display = 'block';
            
            // Clear cart, update badge
            cart = [];
            updateCartBadge();
        };
    }

});
