export interface TextStyle {
  fontSize: string;
  color: string;
  fontStyle: string; // normal, italic
  fontFamily: string;
}

export interface BoxStyle {
  enabled: boolean;
  backgroundColor: string;
  backgroundOpacity: number;
  borderColor: string;
  borderOpacity: number;
}

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
    theme?: string;
    bgColor: string;
    globalFontFamily: string; // common fallback or selector
    globalTextColor: string; // common fallback or selector
    textStyles: {
      title: TextStyle;
      preTitle: TextStyle;
      countdownNumbers: TextStyle;
      countdownLabels: TextStyle;
      infoHeaders: TextStyle;
      infoDescriptions: TextStyle;
      hostLabel: TextStyle;
      hostName: TextStyle;
    };
    boxStyles?: {
      countdown: BoxStyle;
      additionalInfo: BoxStyle;
    };
  };
}
