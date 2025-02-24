enum PositionNumber {
  FIRST = 1,
  SECOND = 2,
}

export function producerDocumentIsValid(producerDocument: string) {
  const isValidDocumentOnlyNumbers = /^[0-9]{11}$|^[0-9]{14}$/.test(
    producerDocument,
  );

  if (!isValidDocumentOnlyNumbers) return false;

  const isCpf = producerDocument.length === 11;
  const isCnpj = producerDocument.length === 14;

  const documentNumbersList = Array.from(producerDocument);

  const calcCpfValidationDigits = (validationDigitPosition: PositionNumber) => {
    const reverseDocumentToList = [...documentNumbersList];

    if (isCnpj) {
      reverseDocumentToList.reverse();
      reverseDocumentToList.splice(
        0,
        validationDigitPosition === PositionNumber.FIRST ? 2 : 1,
      );
    }

    if (isCpf) {
      reverseDocumentToList.splice(
        validationDigitPosition === PositionNumber.FIRST ? 9 : 10,
        validationDigitPosition === PositionNumber.FIRST ? 2 : 1,
      );
    }

    const documentCheckDigit = reverseDocumentToList.reduce(
      (accumulator: number, currentValue: string, index: number) => {
        const currentDocumentNumber = Number(currentValue);

        const calculateRemainByIndex = isCpf
          ? reverseDocumentToList.length + 1 - index
          : index >= 8
            ? (index - 6) % 10
            : (index + 2) % 10;

        accumulator =
          accumulator + currentDocumentNumber * calculateRemainByIndex;

        const isLastIndex = index === reverseDocumentToList.length - 1;
        const remainder = accumulator % 11;

        if (isLastIndex) {
          accumulator = remainder < 2 ? 0 : 11 - remainder;
        }

        return accumulator;
      },
      0,
    );

    return documentCheckDigit.toString();
  };

  if (isCpf) {
    const isFirstValidationDigitValid =
      documentNumbersList[9] === calcCpfValidationDigits(PositionNumber.FIRST);
    const isSecondValidationDigitsValid =
      documentNumbersList[10] ===
      calcCpfValidationDigits(PositionNumber.SECOND);

    console.log(calcCpfValidationDigits(PositionNumber.FIRST));

    return isFirstValidationDigitValid && isSecondValidationDigitsValid;
  }

  if (isCnpj) {
    const isFirstValidationDigitValid =
      documentNumbersList[12] === calcCpfValidationDigits(PositionNumber.FIRST);
    const isSecondValidationDigitsValid =
      documentNumbersList[13] ===
      calcCpfValidationDigits(PositionNumber.SECOND);

    return isFirstValidationDigitValid && isSecondValidationDigitsValid;
  }

  return false;
}
