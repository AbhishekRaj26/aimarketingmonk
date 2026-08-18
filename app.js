document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Mobile Navigation & Dropdown handling
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Toggle mobile navigation panel
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Handles dropdown triggers
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link');

        // Desktop Hover triggers
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                dropdown.classList.add('open');
            }
        });

        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                dropdown.classList.remove('open');
            }
        });

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Only run JS click toggle on mobile screens
                if (window.innerWidth <= 768) {
                    e.stopPropagation();
                    dropdown.classList.toggle('open');
                    
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('open');
                        }
                    });
                }
            });
        }
    });

    // Handle links click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const isDropdownTrigger = link.closest('.dropdown') && link.classList.contains('nav-link');
            
            // If clicking a normal link, close navigation
            if (!isDropdownTrigger) {
                if (mobileToggle && navMenu) {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
                dropdowns.forEach(d => d.classList.remove('open'));
            }
        });
    });

    // Close dropdowns if clicking anywhere outside on the page (both desktop and mobile)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('open'));
        }
    });

    // ----------------------------------------------------
    // ROI Calculator Logic
    // ----------------------------------------------------
    const budgetSlider = document.getElementById('monthly-budget');
    const cpcSlider = document.getElementById('cpc-estimate');
    const industrySelect = document.getElementById('industry-select');

    const budgetValue = document.getElementById('budget-value');
    const cpcValue = document.getElementById('cpc-value');
    const tradLeadsDisplay = document.getElementById('trad-leads');
    const aiLeadsDisplay = document.getElementById('ai-leads');
    const savingsDisplay = document.getElementById('savings-value');

    // Industry multipliers for conversion rates
    const industryRates = {
        ecommerce: { tradConv: 0.022, aiConv: 0.040, cpcModifier: 0.85 },
        saas: { tradConv: 0.018, aiConv: 0.035, cpcModifier: 0.80 },
        b2b: { tradConv: 0.025, aiConv: 0.050, cpcModifier: 0.75 },
        healthcare: { tradConv: 0.030, aiConv: 0.055, cpcModifier: 0.80 }
    };

    function calculateROI() {
        if (!budgetSlider || !cpcSlider || !industrySelect) return;

        const budget = parseFloat(budgetSlider.value);
        const baseCpc = parseFloat(cpcSlider.value);
        const industry = industrySelect.value;

        // Formats slider text displays
        budgetValue.textContent = `$${budget.toLocaleString()}`;
        cpcValue.textContent = `$${baseCpc.toFixed(2)}`;

        const config = industryRates[industry] || industryRates.b2b;

        // Traditional Math
        const tradClicks = budget / baseCpc;
        const tradLeadsCount = Math.round(tradClicks * config.tradConv);
        const tradCpa = tradLeadsCount > 0 ? (budget / tradLeadsCount) : 0;

        // AI Marketing Monk Math (AI reduces CPC via bidding optimization & boosts conversion rate)
        const aiCpc = baseCpc * config.cpcModifier;
        const aiClicks = budget / aiCpc;
        const aiLeadsCount = Math.round(aiClicks * config.aiConv);
        const aiCpa = aiLeadsCount > 0 ? (budget / aiLeadsCount) : 0;

        // Calculate Cost Savings (What it would cost to get the same number of AI leads at traditional prices)
        const equivalentTradCost = aiLeadsCount * tradCpa;
        const netSavings = Math.max(0, Math.round(equivalentTradCost - budget));

        // Display updates
        tradLeadsDisplay.textContent = `${tradLeadsCount} Leads`;
        tradLeadsDisplay.nextElementSibling.textContent = `at $${Math.round(tradCpa)} CPA`;

        aiLeadsDisplay.textContent = `${aiLeadsCount} Leads`;
        aiLeadsDisplay.nextElementSibling.textContent = `at $${Math.round(aiCpa)} CPA`;

        savingsDisplay.textContent = `$${netSavings.toLocaleString()}`;
    }

    if (budgetSlider && cpcSlider && industrySelect) {
        budgetSlider.addEventListener('input', calculateROI);
        cpcSlider.addEventListener('input', calculateROI);
        industrySelect.addEventListener('change', calculateROI);
        
        // Run initial calculation on page load
        calculateROI();
    }

    // ----------------------------------------------------
    // Contact Form Submission Handling
    // ----------------------------------------------------
    const auditForm = document.getElementById('audit-form');
    const formSuccess = document.getElementById('form-success');

    if (auditForm && formSuccess) {
        auditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Client-side validations
            const nameInput = document.getElementById('client-name');
            const emailInput = document.getElementById('client-email');
            
            if (!nameInput.value.trim() || !emailInput.value.trim()) {
                alert('Please fill out all required fields.');
                return;
            }

            // Simulate form submission status changes
            const submitBtn = auditForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Analyzing Site Data...';
            submitBtn.disabled = true;

            setTimeout(() => {
                auditForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                
                // Reset states
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                auditForm.reset();
            }, 1500);
        });
    }

    // ----------------------------------------------------
    // Newsletter Subscription Form Handling
    // ----------------------------------------------------
    const newsletterForm = document.getElementById('newsletter-form');
    const subscribeSuccess = document.getElementById('subscribe-success');

    if (newsletterForm && subscribeSuccess) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (emailInput.value.trim()) {
                subscribeSuccess.classList.remove('hidden');
                emailInput.value = '';
                
                setTimeout(() => {
                    subscribeSuccess.classList.add('hidden');
                }, 4000);
            }
        });
    }
});
