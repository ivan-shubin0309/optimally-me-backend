export const UsersValidationRules = {
    emailMaxLength: 129,
    passwordMaxLength: 50,
    passwordMinLength: 8,
    firstNameMinLength: 1,
    firstNameMaxLength: 50,
    lastNameMinLength: 1,
    lastNameMaxLength: 50,
    ageMinValue: 18
};

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d~`!@#$%^&*()-_+={}\[\]|\\\/:;"'<>,.?]{8,}$/;

export const PASSWORD_ERROR_MESSAGE = 'should contain at least 1 upper-case letter and 1 digit, spaces are not allowed.';

export const NAME_REGEX = /^[a-zA-Z-]*$/;
export const NAME_ERROR_MESSAGE = 'can only contain letters and dashes.';