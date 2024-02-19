import * as Yup from 'yup';

export const WEBSITE_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
export const websiteSchema = Yup.string().matches(
    WEBSITE_REGEX,
    {
        message: 'Valid Website Required',
        excludeEmptyString: true,
    },
);
