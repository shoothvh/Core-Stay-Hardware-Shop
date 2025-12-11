// ========================================
// CORE STAY - VALIDATION UTILITIES
// ========================================

const Validator = {
    // Email validation
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            valid: re.test(email),
            message: 'E-mail inválido'
        };
    },

    // Password validation (min 6 chars)
    password(password) {
        return {
            valid: password.length >= 6,
            message: 'Senha deve ter no mínimo 6 caracteres'
        };
    },

    // Name validation (min 3 chars)
    name(name) {
        return {
            valid: name.trim().length >= 3,
            message: 'Nome deve ter no mínimo 3 caracteres'
        };
    },

    // Required field
    required(value) {
        return {
            valid: value.trim().length > 0,
            message: 'Este campo é obrigatório'
        };
    },

    // CEP validation (Brazilian postal code)
    cep(cep) {
        const clean = cep.replace(/\D/g, '');
        return {
            valid: clean.length === 8,
            message: 'CEP deve ter 8 dígitos'
        };
    },

    // Phone validation (Brazilian)
    phone(phone) {
        const clean = phone.replace(/\D/g, '');
        return {
            valid: clean.length >= 10 && clean.length <= 11,
            message: 'Telefone inválido'
        };
    },

    // Price validation
    price(price) {
        const num = parseFloat(price);
        return {
            valid: !isNaN(num) && num > 0,
            message: 'Preço deve ser maior que zero'
        };
    },

    // Quantity validation
    quantity(qty) {
        const num = parseInt(qty);
        return {
            valid: !isNaN(num) && num > 0,
            message: 'Quantidade deve ser maior que zero'
        };
    },

    // Match validation (for password confirmation)
    match(value1, value2) {
        return {
            valid: value1 === value2,
            message: 'Os valores não coincidem'
        };
    },

    // URL validation
    url(url) {
        try {
            new URL(url);
            return { valid: true, message: '' };
        } catch {
            return { valid: false, message: 'URL inválida' };
        }
    }
};

// ========================================
// FORM VALIDATION HELPER
// ========================================

function validateForm(rules) {
    let isValid = true;
    const errors = {};

    for (const [fieldId, validators] of Object.entries(rules)) {
        const input = document.getElementById(fieldId);
        if (!input) continue;

        const value = input.value;

        for (const validator of validators) {
            let result;

            if (typeof validator === 'function') {
                result = validator(value);
            } else if (typeof validator === 'string' && Validator[validator]) {
                result = Validator[validator](value);
            }

            if (result && !result.valid) {
                isValid = false;
                errors[fieldId] = result.message;
                input.classList.add('error');

                const errorEl = document.getElementById(fieldId + '-error');
                if (errorEl) {
                    errorEl.textContent = result.message;
                    errorEl.classList.add('show');
                }
                break;
            } else {
                input.classList.remove('error');
                const errorEl = document.getElementById(fieldId + '-error');
                if (errorEl) {
                    errorEl.classList.remove('show');
                }
            }
        }
    }

    return { isValid, errors };
}

// ========================================
// SANITIZATION HELPERS
// ========================================

const Sanitizer = {
    // Remove HTML tags
    html(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // Remove special characters
    alphanumeric(str) {
        return str.replace(/[^a-zA-Z0-9\s]/g, '');
    },

    // Format CEP
    cep(str) {
        const clean = str.replace(/\D/g, '');
        if (clean.length > 5) {
            return clean.substring(0, 5) + '-' + clean.substring(5, 8);
        }
        return clean;
    },

    // Format phone
    phone(str) {
        const clean = str.replace(/\D/g, '');
        if (clean.length === 11) {
            return `(${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`;
        } else if (clean.length === 10) {
            return `(${clean.substring(0, 2)}) ${clean.substring(2, 6)}-${clean.substring(6)}`;
        }
        return clean;
    },

    // Format currency (BRL)
    currency(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(num);
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.Validator = Validator;
    window.Sanitizer = Sanitizer;
    window.validateForm = validateForm;
}
