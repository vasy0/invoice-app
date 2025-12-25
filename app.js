document.addEventListener('DOMContentLoaded', function() {
    const addInvoiceBtn = document.getElementById('addInvoice');
    const clientNameInput = document.getElementById('clientName');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');
    const invoicesContainer = document.getElementById('invoicesContainer');
    const totalInvoicesEl = document.getElementById('totalInvoices');
    const totalAmountEl = document.getElementById('totalAmount');

    let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    let totalAmount = 0;

    function updateStats() {
        totalInvoicesEl.textContent = invoices.length;
        totalAmount = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
        totalAmountEl.textContent = `$${totalAmount.toFixed(2)}`;
    }

    function renderInvoices() {
        if (invoices.length === 0) {
            invoicesContainer.innerHTML = '<p class="empty-message">Нет созданных инвойсов. Добавьте первый!</p>';
            return;
        }

        invoicesContainer.innerHTML = '';
        invoices.forEach((invoice, index) => {
            const invoiceElement = document.createElement('div');
            invoiceElement.className = 'invoice-item';
            invoiceElement.innerHTML = `
                <div class="invoice-info">
                    <h4>${invoice.clientName}</h4>
                    <p>${invoice.description}</p>
                    <small>${new Date(invoice.date).toLocaleDateString('ru-RU')}</small>
                </div>
                <div class="invoice-amount">$${parseFloat(invoice.amount).toFixed(2)}</div>
            `;
            invoicesContainer.appendChild(invoiceElement);
        });
    }

    function addInvoice() {
        const clientName = clientNameInput.value.trim();
        const amount = amountInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!clientName || !amount || !description) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        const newInvoice = {
            id: Date.now(),
            clientName,
            amount: parseFloat(amount).toFixed(2),
            description,
            date: new Date().toISOString()
        };

        invoices.push(newInvoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));

        clientNameInput.value = '';
        amountInput.value = '';
        descriptionInput.value = '';

        renderInvoices();
        updateStats();
        
        // Анимация добавления
        const invoiceItems = document.querySelectorAll('.invoice-item');
        if (invoiceItems.length > 0) {
            invoiceItems[invoiceItems.length - 1].style.animation = 'fadeIn 0.5s';
        }
    }

    addInvoiceBtn.addEventListener('click', addInvoice);

    // Добавляем поддержку Enter в форме
    [clientNameInput, amountInput, descriptionInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addInvoice();
            }
        });
    });

    // Инициализация
    renderInvoices();
    updateStats();

    // Добавляем CSS для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Invoice App инициализирован!');
});