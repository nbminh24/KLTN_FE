'use client';

import { useState, useEffect } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import addressService, { Province, Ward } from '@/lib/services/addressService';
import { showToast } from './Toast';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Mapping địa chỉ cũ (trước 7/2025) → địa chỉ mới (sau sáp nhập)
const OLD_TO_NEW_ADDRESS_MAP: Record<string, { province: string; note: string }> = {
    'Thành phố Thủ Đức': {
        province: 'Thành phố Hồ Chí Minh',
        note: 'Sáp nhập vào TP.HCM',
    },
    'Quận 1': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận 2': { province: 'Thành phố Hồ Chí Minh', note: 'Sáp nhập vào Thủ Đức' },
    'Quận 3': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận 4': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận 5': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận 6': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận 7': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận 8': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận 9': { province: 'Thành phố Hồ Chí Minh', note: 'Sáp nhập vào Thủ Đức' },
    'Quận 10': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận 11': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận 12': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận Bình Thạnh': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận Tân Bình': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận Tân Phú': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận Phú Nhuận': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận Gò Vấp': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
    'Quận Bình Tân': { province: 'Thành phố Hồ Chí Minh', note: 'Quận thuộc TP.HCM' },
};

interface AddressFormProps {
    onSubmit: (data: AddressFormData) => void;
    onCancel: () => void;
    initialData?: Partial<AddressFormData>;
    isEditing?: boolean;
}

export interface AddressFormData {
    province: string;
    province_code?: string;
    ward: string;
    ward_code?: string;
    street_address: string;
    phone_number: string;
    latitude?: number;
    longitude?: number;
    address_source: 'gps' | 'manual';
    address_type: 'Home' | 'Office';
    is_default: boolean;
}

export default function AddressForm({ onSubmit, onCancel, initialData, isEditing }: AddressFormProps) {
    const [loadingGPS, setLoadingGPS] = useState(false);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    const [formData, setFormData] = useState<AddressFormData>({
        province: '',
        ward: '',
        street_address: '',
        phone_number: '',
        address_source: 'manual',
        address_type: 'Home',
        is_default: false,
        ...initialData,
    });

    useEffect(() => {
        loadProvinces();
    }, []);

    // Load wards when editing and province exists
    useEffect(() => {
        if (initialData?.province && provinces.length > 0) {
            const province = provinces.find(p => p.name === initialData.province);
            if (province && !formData.province_code) {
                setFormData(prev => ({
                    ...prev,
                    province_code: province.code,
                }));
                loadWards(province.code);
            }
        }
    }, [provinces, initialData]);

    // Set ward_code when wards are loaded
    useEffect(() => {
        if (initialData?.ward && wards.length > 0 && !formData.ward_code) {
            const ward = wards.find(w => w.name === initialData.ward);
            if (ward) {
                setFormData(prev => ({
                    ...prev,
                    ward_code: ward.code,
                }));
            }
        }
    }, [wards, initialData]);

    const loadProvinces = async () => {
        try {
            setLoadingProvinces(true);
            const response = await addressService.getProvinces();
            setProvinces(response.data);
        } catch (error) {
            console.error('Failed to load provinces:', error);
            showToast('Không thể tải danh sách tỉnh/thành phố', 'error');
        } finally {
            setLoadingProvinces(false);
        }
    };

    const loadWards = async (provinceCode: string) => {
        try {
            setLoadingWards(true);
            setWards([]);
            const response = await addressService.getWardsByProvince(provinceCode);
            setWards(response.data);
        } catch (error) {
            console.error('Failed to load wards:', error);
            showToast('Không thể tải danh sách xã/phường', 'error');
        } finally {
            setLoadingWards(false);
        }
    };

    const handleProvinceChange = (code: string) => {
        const province = provinces.find(p => p.code === code);
        if (province) {
            setFormData({
                ...formData,
                province: province.name,
                province_code: code,
                ward: '',
                ward_code: undefined,
            });
            loadWards(code);
        }
    };

    const handleWardChange = (code: string) => {
        const ward = wards.find(w => w.code === code);
        if (ward) {
            setFormData({
                ...formData,
                ward: ward.name,
                ward_code: code,
            });
        }
    };

    const handleGetGPS = async () => {
        if (!navigator.geolocation) {
            showToast('Trình duyệt không hỗ trợ GPS', 'error');
            return;
        }

        setLoadingGPS(true);

        // Ensure provinces are loaded before GPS conversion
        if (provinces.length === 0) {
            await loadProvinces();
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await addressService.reverseGeocode(latitude, longitude);
                    const addressData = response.data;
                    console.log('🗺️ Reverse geocode response:', addressData);

                    let finalProvinceName = addressData.province;
                    let finalWardName = addressData.ward || addressData.district || '';
                    let finalStreetAddress = addressData.street_address || '';

                    // Luôn gọi Track-Asia Convert API để chuyển đổi địa chỉ sang định dạng mới
                    console.log('🔄 Converting address via Track-Asia API...');
                    try {
                        const latlng = `${latitude},${longitude}`;
                        const convertResponse = await addressService.convertAddress(
                            addressData.display_name,
                            latlng
                        );

                        console.log('📡 Track-Asia API response:', convertResponse);

                        if (convertResponse.status === 'OK' && convertResponse.results && convertResponse.results.length > 0) {
                            const result = convertResponse.results[0];

                            // Parse address_components
                            const components = result.address_components;

                            // Tìm province (administrative_area_level_1)
                            const provinceComp = components.find(c => c.types.includes('administrative_area_level_1'));
                            if (provinceComp) {
                                finalProvinceName = provinceComp.long_name;
                            }

                            // Tìm ward/district (locality)
                            const wardComp = components.find(c => c.types.includes('locality'));
                            if (wardComp) {
                                finalWardName = wardComp.long_name;
                            }

                            // Lấy street từ component đầu tiên (không có types)
                            const streetComp = components.find(c => c.types.length === 0);
                            if (streetComp) {
                                finalStreetAddress = streetComp.long_name;
                            }

                            console.log('✅ Converted address:', {
                                province: finalProvinceName,
                                ward: finalWardName,
                                street: finalStreetAddress,
                                full: result.formatted_address,
                            });
                            showToast('📍 Đã lấy vị trí và chuyển đổi địa chỉ thành công', 'success');
                        } else {
                            console.warn('⚠️ Track-Asia API returned no results, using reverse geocode data');
                            showToast('Đã lấy vị trí thành công', 'success');
                        }
                    } catch (convertError) {
                        console.error('⚠️ Track-Asia API failed:', convertError);
                        showToast('Đã lấy vị trí (sử dụng địa chỉ gốc)', 'warning');
                    }

                    // Tìm province trong danh sách
                    const selectedProvince = provinces.find(p => p.name === finalProvinceName);
                    console.log('🏙️ Selected province:', selectedProvince);

                    if (selectedProvince) {
                        await loadWards(selectedProvince.code);

                        // Tìm ward trong danh sách (chờ wards được load)
                        setTimeout(() => {
                            const currentWards = wards;
                            const selectedWard = currentWards.find(w =>
                                w.name === finalWardName ||
                                finalWardName.includes(w.name) ||
                                w.name.includes(finalWardName)
                            );
                            console.log('📍 Selected ward:', selectedWard);

                            setFormData(prev => ({
                                ...prev,
                                province: finalProvinceName,
                                province_code: selectedProvince.code,
                                ward: selectedWard?.name || finalWardName,
                                ward_code: selectedWard?.code,
                                street_address: finalStreetAddress,
                                latitude,
                                longitude,
                                address_source: 'gps',
                            }));
                        }, 500);
                    } else {
                        console.error('❌ Province not found:', finalProvinceName);
                        console.log('📝 Available provinces:', provinces.map(p => p.name));
                        showToast('Không tìm thấy tỉnh/thành phố trong danh sách. Vui lòng nhập thủ công.', 'error');
                    }
                } catch (error) {
                    console.error('Reverse geocoding failed:', error);
                    showToast('Không thể lấy địa chỉ từ GPS', 'error');
                } finally {
                    setLoadingGPS(false);
                }
            },
            (error) => {
                console.error('GPS error:', error);
                setLoadingGPS(false);
                showToast('Không thể truy cập GPS. Vui lòng cho phép truy cập vị trí.', 'error');
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.province || !formData.ward || !formData.street_address || !formData.phone_number) {
            showToast('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">{isEditing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* GPS Button */}
                <button
                    type="button"
                    onClick={handleGetGPS}
                    disabled={loadingGPS}
                    className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 text-blue-700"
                >
                    {loadingGPS ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang lấy vị trí...
                        </>
                    ) : (
                        <>
                            <Navigation className="w-4 h-4" />
                            Lấy vị trí hiện tại từ GPS
                        </>
                    )}
                </button>

                {/* Province Select */}
                <div className="space-y-2">
                    <Label>Tỉnh/Thành phố *</Label>
                    <Select
                        value={formData.province_code || ''}
                        onValueChange={(value) => handleProvinceChange(value)}
                        disabled={loadingProvinces}
                        required
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                            {provinces.map((province) => (
                                <SelectItem key={province.code} value={province.code}>
                                    {province.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Ward Select */}
                <div className="space-y-2">
                    <Label>Xã/Phường *</Label>
                    <Select
                        value={formData.ward_code || ''}
                        onValueChange={(value) => handleWardChange(value)}
                        disabled={!formData.province_code || loadingWards}
                        required
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue placeholder="Chọn Xã/Phường" />
                        </SelectTrigger>
                        <SelectContent>
                            {wards.map((ward) => (
                                <SelectItem key={ward.code} value={ward.code}>
                                    {ward.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {loadingWards && (
                        <p className="text-xs text-gray-500 mt-1">Đang tải danh sách xã/phường...</p>
                    )}
                </div>

                {/* Street Address */}
                <div>
                    <label className="block text-sm font-medium mb-2">Địa chỉ chi tiết *</label>
                    <input
                        type="text"
                        required
                        value={formData.street_address}
                        onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                        placeholder="Số nhà, tên đường..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        placeholder="0901234567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

                {/* Address Type */}
                <div className="space-y-2">
                    <Label>Loại địa chỉ</Label>
                    <Select
                        value={formData.address_type}
                        onValueChange={(value) => setFormData({ ...formData, address_type: value as 'Home' | 'Office' })}
                    >
                        <SelectTrigger className="h-11">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Home">Nhà riêng</SelectItem>
                            <SelectItem value="Office">Văn phòng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Is Default */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.is_default}
                        onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                        className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Đặt làm địa chỉ mặc định</span>
                </label>

                {/* GPS Info */}
                {formData.latitude && formData.longitude && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">Vị trí GPS đã lưu</p>
                            <p className="text-xs text-blue-600">
                                {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition"
                    >
                        {isEditing ? 'Cập nhật' : 'Lưu địa chỉ'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 border border-gray-300 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}
