// Test Track-Asia Convert Address API
const testConvertAddress = async () => {
    const testCases = [
        {
            name: 'Test 1: Thủ Đức (cũ) → HCM (mới)',
            text: 'Nhà Hàng Chay Vĩnh Nghiêm, Hẻm 331 Nam Kỳ Khởi Nghĩa, Khu phố 21, Phường Xuân Hòa, Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
            latlng: '10.851139,106.767747',
        },
        {
            name: 'Test 2: Landmark 81 - Quận Bình Thạnh (cũ) → Phường Thạnh Mỹ Tây (mới)',
            text: 'Landmark 81 720A Đường Điện Biên Phủ, Phường 22, Quận Bình Thạnh, Thành phố Hồ Chí Minh',
            latlng: '10.795067,106.722045',
        },
        {
            name: 'Test 3: Quận 2 (cũ) → TP Thủ Đức (mới)',
            text: 'Đường Nguyễn Duy Trinh, Phường Bình Trưng Đông, Quận 2, Thành phố Hồ Chí Minh',
            latlng: '10.797729,106.761800',
        },
    ];

    for (const testCase of testCases) {
        console.log('\n' + '='.repeat(70));
        console.log(`📝 ${testCase.name}`);
        console.log('='.repeat(70));
        console.log('📤 Text:', testCase.text);
        console.log('📍 Latlng:', testCase.latlng);

        try {
            const params = new URLSearchParams({
                text: testCase.text,
                migrate_type: 'old_to_new',
                latlng: testCase.latlng,
                key: 'public_key',
            });

            const url = `https://maps.track-asia.com/api/v2/place/convert/json?${params.toString()}`;
            console.log('🌐 URL:', url);

            const response = await fetch(url);
            const result = await response.json();

            console.log('\n📥 Response:', JSON.stringify(result, null, 2));

            if (result.status === 'OK') {
                console.log('\n✅ Success!');
                console.log('🏠 New Address:', result.result.address);
                console.log('🏙️  Province:', result.result.province || 'N/A');
                console.log('🏘️  District:', result.result.district || 'N/A');
                console.log('🏡 Ward:', result.result.ward || 'N/A');
                console.log('🛣️  Street:', result.result.street || 'N/A');
            } else {
                console.log('\n❌ Status:', result.status);
                if (result.error_message) {
                    console.log('❌ Error:', result.error_message);
                }
            }
        } catch (error) {
            console.error('\n❌ Error:', error.message);
        }
    }
};

// Run test
testConvertAddress();
