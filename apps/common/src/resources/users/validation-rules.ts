export const UsersValidationRules = {
    emailMaxLength: 129,
    passwordMaxLength: 50,
    passwordMinLength: 8
};

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const PASSWORD_ERROR_MESSAGE = 'should contain at least 1 upper-case letter and 1 digit, spaces are not allowed.';

