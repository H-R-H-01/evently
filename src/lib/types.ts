export interface EventConfig {
  eventName: string;
  eventDate: string;
  timezone: string;
  userInfo: {
    name: string;
    email: string;
    phoneCode: string;
    phone: string;
  };
  additionalInfo: {
    header: string;
    description: string;
  }[];
  style: {
    textColor: string;
    bgColor: string;
    fontFamily: string;
    fontSize: string;
  };
}
