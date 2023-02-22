import { UserAdditionalField } from '../../users/src/models/user-additional-field.entity';
import { User } from '../../users/src/models';
import { UserWidgetSetting } from './models/user-widget-setting.entity';

export const modelProviders = [
    {
        provide: 'USER_MODEL',
        useValue: User,
    },
    {
        provide: 'USER_ADDITIONAL_FIELD_MODEL',
        useValue: UserAdditionalField,
    },
    {
        provide: 'USER_WIDGET_SETTING_MODEL',
        useValue: UserWidgetSetting
    }
];