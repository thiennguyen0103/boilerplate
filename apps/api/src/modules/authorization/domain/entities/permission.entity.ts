export interface PermissionProps {
  id: string;
  code: string;
  description: string | null;
  createdAt: Date;
}

export class Permission {
  private constructor(private readonly props: PermissionProps) {}

  static reconstitute(props: PermissionProps): Permission {
    return new Permission(props);
  }

  get id(): string {
    return this.props.id;
  }

  get code(): string {
    return this.props.code;
  }

  get description(): string | null {
    return this.props.description;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
