document.addEventListener('DOMContentLoaded', () => {
    // --- CẬP NHẬT COUNTER ---
    updateCartCounter();

    // --- SỰ KIỆN NÚT "THÊM VÀO GIỎ HÀNG" ---
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(button);
            updateCartCounter();
        });
    });

    // --- HIỂN THỊ GIỎ HÀNG ---
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const container = document.querySelector('.cart-section .card-body');

    if (cart.length === 0) {
        container.innerHTML = '<p>Giỏ hàng của bạn đang trống.</p>';
        return;
    }

    let total = 0;
    let html = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="row align-items-center mb-3 cart-item" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                <div class="col-md-2">
                    <img src="${item.image}" class="cart-item-image" alt="${item.name}">
                </div>
                <div class="col-md-5">
                    <h5 class="mb-1">${item.name}</h5>
                    <p class="text-muted mb-0">Size: ${item.size}</p>
                    <p class="text-muted mb-0">Màu: ${item.color}</p>
                </div>
                <div class="col-md-3">
                    <div class="input-group">
                        <button class="btn btn-outline-secondary quantity-minus" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">-</button>
                        <input type="number" class="form-control border border-secondary quantity-input" value="${item.quantity}" min="1">
                        <button class="btn btn-outline-secondary quantity-plus" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">+</button>
                    </div>
                </div>
                <div class="col-md-2 text-end">
                    <span class="fw-bold">${itemTotal.toLocaleString()}đ</span>
                    <button class="btn btn-link text-danger btn-delete" data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <hr>
        `;
    });

    container.innerHTML = html;

    // Tổng đơn hàng
    const tamTinhEl = document.querySelector('.card-title + .d-flex span:last-child');
    const tongCongEl = document.querySelector('.fw-bold .text-danger');
    if (tamTinhEl) tamTinhEl.textContent = total.toLocaleString() + 'đ';
    if (tongCongEl) tongCongEl.textContent = (total + 30000).toLocaleString() + 'đ';

    // --- XOÁ SẢN PHẨM ---
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const size = btn.getAttribute('data-size');
            const color = btn.getAttribute('data-color');

            let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            cart = cart.filter(item => !(item.id === id && item.size === size && item.color === color));

            localStorage.setItem('cartItems', JSON.stringify(cart));
            localStorage.setItem('cartCount', cart.reduce((sum, item) => sum + item.quantity, 0));

            location.reload();
        });
    });

    // --- TĂNG GIẢM SỐ LƯỢNG ---
    document.querySelectorAll('.quantity-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const size = btn.getAttribute('data-size');
            const color = btn.getAttribute('data-color');

            let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            const item = cart.find(i => i.id === id && i.size === size && i.color === color);
            if (item) item.quantity += 1;

            localStorage.setItem('cartItems', JSON.stringify(cart));
            localStorage.setItem('cartCount', getTotalQuantity(cart));
            location.reload();
        });
    });

    document.querySelectorAll('.quantity-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const size = btn.getAttribute('data-size');
            const color = btn.getAttribute('data-color');

            let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            const item = cart.find(i => i.id === id && i.size === size && i.color === color);
            if (item && item.quantity > 1) item.quantity -= 1;

            localStorage.setItem('cartItems', JSON.stringify(cart));
            localStorage.setItem('cartCount', getTotalQuantity(cart));
            location.reload();
        });
    });
});

// --- HÀM THÊM VÀO GIỎ HÀNG ---
function addToCart(button) {
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const image = button.getAttribute('data-image');
    const price = parseInt(button.getAttribute('data-price'));
    const size = button.getAttribute('data-size');
    const color = button.getAttribute('data-color');

    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

    const existingProduct = cart.find(item =>
        item.id === id && item.size === size && item.color === color
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            image,
            price,
            size,
            color,
            quantity: 1
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cart));
    localStorage.setItem('cartCount', getTotalQuantity(cart));
}

// --- HÀM ĐẾM SỐ LƯỢNG SP ---
function getTotalQuantity(cart) {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// --- HÀM CẬP NHẬT ICON GIỎ ---
function updateCartCounter() {
    const currentCount = localStorage.getItem('cartCount') || 0;
    document.querySelectorAll('.cart-counter').forEach(counter => {
        counter.textContent = currentCount;
    });
}
