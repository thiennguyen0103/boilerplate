# Forms and Validation

## Principles

- Keep forms accessible.
- Provide clear labels and validation feedback.
- Validate user input before submission for usability.
- Always validate again on the backend.
- Avoid duplicating complex business validation in the frontend.

## Form Design

- Group related fields.
- Use appropriate input types.
- Provide clear submission states.
- Prevent accidental duplicate submissions where appropriate.
- Preserve user input when recoverable errors occur.

## Validation

Frontend validation should focus on immediate feedback.

Backend validation remains authoritative.

## Error States

Support:

- Required field errors.
- Format errors.
- Server validation errors.
- Network errors.
- Submission errors.

## Accessibility

- Associate labels with inputs.
- Connect error messages to relevant fields.
- Support keyboard navigation.
- Announce relevant validation feedback to assistive technology.
