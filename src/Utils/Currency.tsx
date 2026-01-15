const formatCurrency = (value: string | number, withSign = false) => {
    let price: number;

    // CASO 1: Valor numérico vindo do Backend (ex: 50 ou 50.5)
    // Se for número, confiamos no valor e não dividimos por 100
    if (typeof value === "number") {
        price = value;
    } 
    // CASO 2: Valor string vindo do Input (ex: "5050" digitado)
    // Se for string, assumimos que é digitação e aplicamos a lógica dos centavos
    else {
        const numericValue = value.replace(/\D/g, "");
        if (!numericValue) return "";
        price = Number(numericValue) / 100;
    }

    // Configurações de formatação
    const options: Intl.NumberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    if (withSign) {
        options.style = "currency";
        options.currency = "BRL";
    }

    return new Intl.NumberFormat("pt-BR", options).format(price);
};

export default formatCurrency;