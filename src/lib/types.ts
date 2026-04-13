export interface BaseConfig {
  type?: 'countdown' | 'invitation';
}

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

export interface EventConfig extends BaseConfig {
  type?: 'countdown';
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
    globalFontFamily: string;
    globalTextColor: string;
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

export interface InvitationConfig extends BaseConfig {
  type: 'invitation';
  eventType: 'marriage' | 'birthday' | 'custom';
  title: string;
  primaryName: string;
  secondaryName?: string;
  date: string;
  imageUrl: string; 
  themeId: string;
  location?: string;
  venue?: string;
  message?: string;
  news?: {
    date: string;
    title: string;
    description: string;
  }[];
  heroImageUrl?: string;
  newsImageUrl?: string;
  imageStyle?: {
    showBorder: boolean;
    borderColor: string;
    paddingX: number;
    paddingY: number;
  };
}

export type AnyConfig = EventConfig | InvitationConfig;
