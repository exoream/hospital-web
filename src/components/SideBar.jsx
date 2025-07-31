import { useState } from 'react';
import {
    LayoutDashboard, ClipboardList, Clock, Calendar, FileText
} from 'lucide-react';
import SidebarItem from './SidebarItem';

const Sidebar = ({ onMenuSelect, role }) => {
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleItemClick = (label, isSubItem = false, subItems = []) => {
        if (!isSubItem && subItems.length > 0) {
            // Klik menu utama yang punya dropdown
            const defaultSubItem = `${label} > ${subItems[0]}`;
            setActiveItem(defaultSubItem);
            setOpenDropdown(openDropdown === label ? null : label);
            onMenuSelect(defaultSubItem);
        } else {
            // Klik subitem atau item biasa
            setActiveItem(label);
            if (!isSubItem) {
                setOpenDropdown(openDropdown === label ? null : label);
            }
            onMenuSelect(label);
        }
    };

    const menuItemsByRole = {
        admin: [
            {
                icon: <LayoutDashboard className="h-5 w-5" />,
                label: 'Dashboard',
                hasDropdown: false
            },
            {
                icon: <ClipboardList className="h-5 w-5" />,
                label: 'Daftar Pasien',
                hasDropdown: true,
                subItems: ['Buat Akun Pasien', 'Data Pasien']
            },
            {
                icon: <Clock className="h-5 w-5" />,
                label: 'Daftar Konsultasi Pasien',
                hasDropdown: false,
            },
            {
                icon: <Calendar className="h-5 w-5" />,
                label: 'Jadwal Kunjungan',
                hasDropdown: true,
                subItems: ['Buat Jadwal', 'Jadwal Kunjungan']
            },
            {
                icon: <FileText className="h-5 w-5" />,
                label: 'Laporan Kesehatan',
                hasDropdown: true,
                subItems: ['Cetak Laporan']
            }
        ],
        pasien: [
            {
                icon: <LayoutDashboard className="h-5 w-5" />,
                label: 'Dashboard',
                hasDropdown: false
            },
            {
                icon: <Calendar className="h-5 w-5" />,
                label: 'Tambah Riwayat',
                hasDropdown: false,
            },
            {
                icon: <Calendar className="h-5 w-5" />,
                label: 'Notifikasi',
                hasDropdown: true,
                subItems: ['Catatan Kesehatan', 'Jadwal Kunjungan']
            }
        ]
    };

    const menuItems = menuItemsByRole[role] || [];

    return (
        <div className="h-full border-r border-gray-100 bg-white shadow-sm pt-4 pb-2  no-print">
            <div className="px-4 mb-6">
                <div className="text-xs font-medium uppercase text-gray-400 mb-2 pl-2">Main Menu</div>
            </div>
            {menuItems.map((item) => (
                <SidebarItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeItem === item.label || activeItem.startsWith(`${item.label} >`)}
                    hasDropdown={item.hasDropdown}
                    subItems={item.subItems}
                    onClick={(label, isSubItem) => handleItemClick(label, isSubItem, item.subItems)}
                    activeItem={activeItem}
                    isOpen={openDropdown === item.label}
                />
            ))}

            <div className="mt-10 mx-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="text-xs font-medium text-green-800 mb-2">Sistem Kesehatan</div>
                <div className="text-xs text-gray-600">
                    v1.2.0 - Puskesmas Camba
                    <div className="mt-2 text-green-600 cursor-pointer text-xs font-medium">Lihat Update</div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;