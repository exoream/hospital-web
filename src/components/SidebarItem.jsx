import { ChevronDown, ChevronRight } from 'lucide-react';

const SidebarItem = ({
    icon, label, isActive, hasDropdown, subItems = [], onClick, activeItem, isOpen }) => {

    const handleClick = () => {
        onClick(label);
    };


    return (
        <div className="mb-1">
            <div
                className={`flex items-center p-3 cursor-pointer transition-all duration-200 rounded-lg mx-2 
                ${isActive ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md hover:shadow-lg' : 'text-gray-600 hover:bg-green-50'}`}
                onClick={handleClick}
            >
                <div className={`mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-green-600'}`}>{icon}</div>
                <span className="flex-grow text-sm font-medium">{label}</span>
                {hasDropdown && (
                    <div className="ml-2">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                )}
            </div>

            {isOpen && hasDropdown && subItems.length > 0 && (
                <div className="ml-10 mt-1 mb-2 text-sm font-medium text-gray-600 space-y-1">
                    {subItems.map((item, index) => {
                        const fullLabel = `${label} > ${item}`;
                        const isSubItemActive = activeItem === fullLabel;

                        return (
                            <div
                                key={index}
                                className={`cursor-pointer py-1 ${isSubItemActive ? 'text-green-700 font-semibold' : 'hover:text-green-600'
                                    }`}
                                onClick={() => onClick(fullLabel, true)} // ✅ Tambah flag ini
                            >
                                {item}
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default SidebarItem;
