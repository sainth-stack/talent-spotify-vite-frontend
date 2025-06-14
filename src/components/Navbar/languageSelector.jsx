import React, { useState } from 'react';
import globe from '../../assets/svg/globe.svg'; // Adjust path as needed
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const LanguageSelector = () => {
    const { i18n ,t} = useTranslation(); // Access i18n instance
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language

    const languages = [
        { id: 1, name: t("English"), code: 'en' },
        { id: 2, name: t("Hindi"), code: 'hi' },
        { id: 3, name: t("Spanish"), code: 'es' },
        { id: 4, name: t("Arabic"), code: 'ar' },
        { id: 5, name: t("Telugu"), code: 'tel' },
    ];

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLanguageChange = (code) => {
        setSelectedLanguage(code);
        console.log(`Switching to ${code} language`);
        i18n.changeLanguage(code); // Change language using i18next
        setShowDropdown(false); // Hide dropdown after selection
    };

    return (
        <div className="nav-item dropdown mx-1 userdropdown d-flex align-items-center">
            <label htmlFor="language-dropdown" className="cursor-pointer" onClick={toggleDropdown}>
                <img src={globe} className="notifications-pic" alt="help-icon" />
            </label>
            <div className={`dropdown-menu dropdown-menu-right user-dropdown ${showDropdown ? 'show' : ''}`} id="language-dropdown">
                <ul className='p-0 m-0'>
                    {languages.map((lang) => (
                        <li key={lang.id} className="dropdown-item cursor-pointer" onClick={() => handleLanguageChange(lang.code)}>
                            {lang.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LanguageSelector;
