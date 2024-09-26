import React, { useState } from 'react';
import axios from 'axios';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('PEN');
    const [toCurrency, setToCurrency] = useState('USD');
    const [conversionRate, setConversionRate] = useState(null);
    const [error, setError] = useState(null);

    const apiKey = '6335964dee0fefbc1f253771206757f0'; // Reemplaza con tu API Key

    // Función para obtener el tipo de cambio actual
    const fetchConversionRate = async () => {
        setError(null); // Reseteamos el error
        try {
            const response = await axios.get(
                `http://apilayer.net/api/live?access_key=${apiKey}&currencies=${toCurrency}&source=${fromCurrency}&format=1`
            );

            const quotes = response.data.quotes;
            if (response.data.success && quotes && quotes[`${fromCurrency}${toCurrency}`]) {
                const rate = quotes[`${fromCurrency}${toCurrency}`];
                setConversionRate(rate);
            } else {
                throw new Error(response.data.error?.info || 'Datos de conversión no disponibles.');
            }
        } catch (error) {
            console.error('Error al obtener el tipo de cambio:', error);
            setError(`Error al obtener los tipos de cambio: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetchConversionRate();
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Cantidad</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}  // Solo actualizamos el valor del estado
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Moneda de origen</label>
                    <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="form-control"
                    >
                        <option value="PEN">PEN</option>
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Moneda de destino</label>
                    <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="form-control"
                    >
                        <option value="USD">USD</option>
                        <option value="PEN">PEN</option>
                        <option value="CAD">CAD</option>
                        <option value="EUR">EUR</option>
                        <option value="AUD">AUD</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Convertir
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {conversionRate && (
                <div className="result">
                    <h4>
                        {amount} {fromCurrency} = {(amount * conversionRate).toFixed(2)} {toCurrency}
                    </h4>
                </div>
            )}
        </div>
    );
};

export default CurrencyConverter;
