import { producerDocumentIsValid } from '.';

describe('producerDocumentIsValid', () => {
  it('The producerDocumentIsValid need to be a function', () => {
    expect(producerDocumentIsValid).toBeDefined();
    expect(typeof producerDocumentIsValid).toBe('function');
  });

  describe('CPF validation', () => {
    it('The CPF validation need to return true when the data is a valid CPF number', () => {
      const producerDocument = '46751972059';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(true);
    });

    it('The CPF validation need to return false when the data is a invalid CPF number', () => {
      const producerDocument = '46751972052';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(false);
    });

    it('The CPF validation need to return false when the data does not have a minimun CPF size', () => {
      const producerDocument = '123';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(false);
    });

    it('The CPF validation need to return false when the data does not have 11 numbers', () => {
      const producerDocument = '467519720590';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(false);
    });

    it('The CPF validation need to return false when the data contains characters that does not are numbers', () => {
      const producerDocument = '123@456789X';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(false);
    });
  });

  describe('CNPJ validation', () => {
    it('The CNPJ validation need to return true when the data is a valid CPF number', () => {
      const producerDocument = '83450822000100';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(true);
    });

    it('The CNPJ validation need to return false when the data is a invalid CNPJ number', () => {
      const producerDocument = '83450822000109';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(false);
    });

    it('The CNPJ validation need to return false when the data does not have a minimun CNPJ size', () => {
      const producerDocument = '83450822000';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(false);
    });

    it('The CNPJ validation need to return false when the data does not have 14 numbers', () => {
      const producerDocument = '834508220001005';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(false);
    });

    it('The CNPJ validation need to return false when the data contains characters that does not are numbers', () => {
      const producerDocument = '8345-822#0001XX';
      const result: boolean = producerDocumentIsValid(producerDocument);

      expect(result).toBeDefined();
      expect(result).toBe(false);
    });
  });
});
