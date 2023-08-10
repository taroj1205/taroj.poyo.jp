import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const GoBack: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <button
            type="button"
            className="text-indigo-500 hover:text-indigo-600 underline hover:no-underline text-sm"
            onClick={() => router.push('/auth/login')}
        >
            {t('goBack')}
        </button>
    );
};

export default GoBack;