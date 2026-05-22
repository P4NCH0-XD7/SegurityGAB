import { formatPrice } from '../../src/utils/formatters';

describe('Utilidad formatPrice', () => {
  it('debería formatear números a pesos colombianos correctamente', () => {
    // 1. Preparar
    const cantidad = 150000;
    
    // 2. Actuar
    const formateado = formatPrice(cantidad);
    
    // 3. Comprobar
    // Verificamos que contenga el símbolo de dólar/peso o las siglas de la moneda
    expect(formateado).toMatch(/[\$|COP]/i); 
    
    // Verificamos de forma segura que contenga los dígitos correctos (150.000)
    // eliminando los espacios vacíos que la configuración regional suele agregar
    const normalizado = formateado.replace(/\s+/g, '').replace(/\u00A0/g, '');
    expect(normalizado).toContain('150.000');
  });

  it('debería formatear el número 0 correctamente', () => {
    const formateado = formatPrice(0);
    const normalizado = formateado.replace(/\s+/g, '').replace(/\u00A0/g, '');
    expect(normalizado).toContain('0');
  });
});
