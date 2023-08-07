import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select, { StylesConfig } from 'react-select';
import { ThemeOption, getThemeOptions } from './doc/data';
import { t } from 'i18next';
import { useTheme } from 'next-themes'

const selectStyles: StylesConfig<ThemeOption, false> = {
    control: (provided) => ({
        ...provided,
        minWidth: 240,
        margin: 8,
    }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
};

export default () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [value, setValue] = useState<ThemeOption | null>();
    const themeOptions: readonly ThemeOption[] = getThemeOptions(t);

    const [isDarkMode, setIsDarkMode] = useState(false);

    // Function to check if the documentElement has the class 'dark'
    const isDocumentDark = () => document.documentElement.classList.contains('dark');

    // Set the initial isDarkMode state based on the class on mount
    useEffect(() => {
        setIsDarkMode(isDocumentDark());
    }, []);

    // Listen for changes to the class attribute of the documentElement
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(isDocumentDark());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const defaultThemeOption = themeOptions.find((option) => theme && theme.includes(option.value));
        if (defaultThemeOption) {
            setValue(defaultThemeOption);
        } else {
            setValue(themeOptions[1]);
        }
    }, []);

    return (
        <Dropdown
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            target={
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={value && value.value === 'dark' ? 'dark:text-white' : ''}
                >
                    <span className='dark:text-white flex items-center'>
                        {isOpen ? (
                            <ChevronDown color={isDarkMode ? 'white' : 'black'} />
                        ) : (
                            <ChevronDown color="gray" />
                        )}
                    </span>
                </button>
            }
        >
            <Select
                backspaceRemovesValue={false}
                components={{ DropdownIndicator, IndicatorSeparator: null }}
                controlShouldRenderValue={false}
                hideSelectedOptions={false}
                isClearable={false}
                menuIsOpen
                onChange={(newValue) => {
                    if (newValue) {
                        document.documentElement.className = newValue.value;
                        localStorage.theme = newValue.value;
                        setTheme(newValue.value.toString());
                    }
                    setValue(newValue);
                    setIsOpen(false);
                }}
                options={themeOptions}
                placeholder={t('search')}
                styles={selectStyles}
                tabSelectsValue={false}
                value={value}
            />
        </Dropdown>
    );
};

// styled components

const Menu = (props: JSX.IntrinsicElements['div']) => {
    return (
        <div className='bg-white text-black rounded-md shadow-sm mt-2 absolute z-10' {...props} />
    );
};
const Blanket = (props: JSX.IntrinsicElements['div']) => (
    <div
        className="fixed top-0 left-0 bottom-0 right-0 z-[1]"
        {...props}
    />
);

const Dropdown = ({
    children,
    isOpen,
    target,
    onClose,
}: {
    children?: ReactNode;
    readonly isOpen: boolean;
    readonly target: ReactNode;
    readonly onClose: () => void;
}) => (
    <div className="relative">
        {target}
        {isOpen && <Menu>{children}</Menu>}
        {isOpen && <Blanket onClick={onClose} />}
    </div>
);
const Svg = (p: JSX.IntrinsicElements['svg']) => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        focusable="false"
        role="presentation"
        {...p}
    />
);
const DropdownIndicator = () => (
    <div className="text-neutral-20 h-[24] w-[32]">
        <Svg>
            <path
                d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </Svg>
    </div>
);
const ChevronDown = ({ color }: { color: string }) => (
    <>
        {t('change.theme')}
        <Svg style={{ marginRight: -6 }}>
            <path
                d="M8.292 10.293a1.009 1.009 0 0 0 0 1.419l2.939 2.965c.218.215.5.322.779.322s.556-.107.769-.322l2.93-2.955a1.01 1.01 0 0 0 0-1.419.987.987 0 0 0-1.406 0l-2.298 2.317-2.307-2.327a.99.99 0 0 0-1.406 0z"
                fill={color} // Use the color prop for the fill color
                fillRule="evenodd" />
        </Svg></>
);