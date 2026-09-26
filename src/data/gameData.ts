import { VietPhucItem, RegionLocation, Quest, TriviaQuestion, Enemy } from '../types/game';

export const INITIAL_VIET_PHUC_ITEMS: VietPhucItem[] = [
  {
    id: 'non_la',
    name: 'Nón Lá Truyền Thống',
    category: 'hat',
    dynastyOrRegion: 'Đồng bằng Bắc Bộ & Toàn quốc',
    description: 'Chiếc nón chóp đan từ lá gồi hoặc lá cọ, mộc mạc che mưa che nắng, biểu tượng ngàn đời của người Việt.',
    lore: 'Nón lá gắn liền với nền văn minh lúa nước sông Hồng. Chiếc nón đơn sơ nâng niu vẻ đẹp chịu thương chịu khó của người dân đất Việt qua bao thế hệ.',
    statsBonus: { defense: 8, hp: 40 },
    color: '#e5d19b',
    secondaryColor: '#8a6828',
    icon: '👒',
    pixelDesign: 'conical_hat',
    unlocked: true, // Starter item
  },
  {
    id: 'non_quai_thao',
    name: 'Nón Quai Thao (Nón Ba Tầm)',
    category: 'hat',
    dynastyOrRegion: 'Xứ Kinh Bắc - Bắc Bộ',
    description: 'Nón tròn dẹt vành rộng đan tinh xảo bằng lá cọ, dây quai thao bằng tơ ngũ sắc buông dài mềm mại.',
    lore: 'Vật phẩm trang phục gắn liền với các liền anh liền chị hát Quan họ quan họ Bắc Ninh, từng làm say đắm bao tao nhân mặc khách.',
    statsBonus: { defense: 14, expBonus: 10 },
    color: '#deb887',
    secondaryColor: '#b85434',
    icon: '✨',
    pixelDesign: 'flat_hat',
    unlocked: false,
  },
  {
    id: 'non_bai_tho',
    name: 'Nón Bài Thơ Xứ Huế',
    category: 'hat',
    dynastyOrRegion: 'Cố Đô Huế - Triều Nguyễn',
    description: 'Chiếc nón lá mỏng nhẹ, soi qua ánh sáng mặt trời sẽ hiện lên những bài thơ và phong cảnh sông Hương núi Ngự.',
    lore: 'Được chế tác kỳ công bởi các nghệ nhân làng nón Tây Hồ, ẩn giấu hồn thơ lãng mạn và sự kín đáo thanh cao của người con gái Huế.',
    statsBonus: { defense: 18, hp: 60, expBonus: 15 },
    color: '#f0e3bc',
    secondaryColor: '#a13b63',
    icon: '📜',
    pixelDesign: 'poem_hat',
    unlocked: false,
  },
  {
    id: 'ao_tu_than',
    name: 'Áo Tứ Thân & Yếm Đào',
    category: 'costume',
    dynastyOrRegion: 'Bắc Bộ (Thế kỷ 12 - 20)',
    description: 'Gồm 4 vạt áo: 2 vạt sau may liền lưng, 2 vạt trước buông tự do hoặc buộc vạt trước ngực, mặc cùng dải yếm đỏ thắm.',
    lore: 'Bốn vạt áo tượng trưng cho tứ thân phụ mẫu (cha mẹ đẻ và cha mẹ chồng), hai vạt trước buộc lại tượng trưng cho tình nghĩa vợ chồng son sắt.',
    statsBonus: { hp: 80, defense: 15, attack: 12 },
    color: '#8b4513',
    secondaryColor: '#c0392b',
    icon: '👘',
    pixelDesign: 'tu_than',
    unlocked: true, // Starter costume
  },
  {
    id: 'ao_giao_linh',
    name: 'Áo Giao Lĩnh (Đại Việt)',
    category: 'costume',
    dynastyOrRegion: 'Thời Lý - Trần - Lê',
    description: 'Cổ áo giao nhau chéo góc sang phải, ống tay thụng dài phong thái nho nhã khoan thai của văn nhân và bậc hiền sĩ.',
    lore: 'Trang phục thịnh hành bậc nhất trong hoàng cung và giới trí thức Đại Việt cổ, thể hiện đạo đức Nho phong và lòng kiêu hãnh dân tộc.',
    statsBonus: { hp: 120, attack: 22, defense: 20 },
    color: '#2a5298',
    secondaryColor: '#d4af37',
    icon: '🏮',
    pixelDesign: 'giao_linh',
    unlocked: false,
  },
  {
    id: 'ao_vien_linh',
    name: 'Áo Viên Lĩnh Thêu Hoa',
    category: 'costume',
    dynastyOrRegion: 'Thời Lê Trung Hưng',
    description: 'Cổ tròn ôm sát khép nút bên vai phải, ngực thêu bổ tử hoa văn mây sóng trang nghiêm dành cho quan lại triều đình.',
    lore: 'Viên Lĩnh gắn liền với lễ nhạc cung đình Đại Việt, từng là biểu trưng cho phẩm hàm và trí tuệ của các vị trung thần phò tá xã tắc.',
    statsBonus: { hp: 160, attack: 28, defense: 26 },
    color: '#27ae60',
    secondaryColor: '#f1c40f',
    icon: '🌿',
    pixelDesign: 'vien_linh',
    unlocked: false,
  },
  {
    id: 'ao_nhat_binh',
    name: 'Áo Nhật Bình Cung Đình',
    category: 'costume',
    dynastyOrRegion: 'Triều Nguyễn - Cố Đô Huế',
    description: 'Áo khoác xẻ trước ngực với cổ áo hình chữ nhật viền hoa văn tinh xảo, tay áo viền ngũ sắc lộng lẫy uy nghiêm.',
    lore: 'Thuở xưa dành riêng cho Hoàng Thái Hậu, Hoàng Hậu, Công Chúa và Phi Tần trong Đại Nội Huế. Mỗi họa tiết thêu phượng, kim tuyến đều là tinh hoa mỹ nghệ.',
    statsBonus: { hp: 220, attack: 35, defense: 38, expBonus: 25 },
    color: '#e74c3c',
    secondaryColor: '#f39c12',
    icon: '👑',
    pixelDesign: 'nhat_binh',
    unlocked: false,
  },
  {
    id: 'ao_ngu_than',
    name: 'Áo Ngũ Thân Tay Chẽn',
    category: 'costume',
    dynastyOrRegion: 'Thời Chúa Nguyễn & Vua Minh Mạng',
    description: 'Áo may từ 5 thân vải ghép lại kín đáo lịch sự, cổ đứng cao, tay chẽn gọn gàng, tiền thân chính thống của chiếc Áo Dài tân thời.',
    lore: 'Năm thân áo tượng trưng cho Ngũ Thường: Nhân - Lễ - Nghĩa - Trí - Tín, năm cúc áo thể hiện Ngũ Luân gìn giữ luân thường đạo lý dân tộc.',
    statsBonus: { hp: 190, attack: 30, defense: 32 },
    color: '#16a085',
    secondaryColor: '#f5b041',
    icon: '🪡',
    pixelDesign: 'ngu_than',
    unlocked: false,
  },
  {
    id: 'ao_ba_ba',
    name: 'Áo Bà Ba & Khăn Rằn',
    category: 'costume',
    dynastyOrRegion: 'Nam Bộ Sông Nước',
    description: 'Áo cánh vạt ngắn xẻ tà hông dễ cử động, may từ vải lụa ú mộc mạc kèm chiếc khăn rằn sọc ca-rô khoác vai hiên ngang.',
    lore: 'Gắn liền với quá trình mở cõi phương Nam, chứng kiến tinh thần phóng khoáng, dũng cảm và kiên trung của đồng bào miền Tây Nam Bộ.',
    statsBonus: { hp: 150, attack: 25, defense: 22 },
    color: '#34495e',
    secondaryColor: '#ecf0f1',
    icon: '🌾',
    pixelDesign: 'ba_ba',
    unlocked: false,
  },
  {
    id: 'tho_cam_tay_nguyen',
    name: 'Trang Phục Thổ Cẩm Tây Nguyên',
    category: 'costume',
    dynastyOrRegion: 'Đại Ngàn Tây Nguyên',
    description: 'Dệt thủ công từ sợi bông rừng nhuộm màu vỏ cây và rễ củ thảo mộc, dải hoa văn cồng chiêng, ngọn lửa và mặt trời rực rỡ.',
    lore: 'Mang linh hồn của đại ngàn hùng vĩ, gắn liền với sử thi Đăm Săn oai phong, lưu giữ tình yêu thiên nhiên và truyền thống mẫu hệ mẫu quyền.',
    statsBonus: { hp: 240, attack: 42, defense: 35 },
    color: '#962d3e',
    secondaryColor: '#f2e394',
    icon: '🔥',
    pixelDesign: 'tho_cam',
    unlocked: false,
  },
  {
    id: 'giap_tru_dai_viet',
    name: 'Chiến Bào Giáp Sắt Đại Việt',
    category: 'costume',
    dynastyOrRegion: 'Nghĩa Quân Nhà Trần (Thế kỷ 13)',
    description: 'Giáp vảy sắt kết da trâu nhuộm chu sa, đai lưng ngọc, vai khảm phù điêu Thần Hổ uy dũng trấn áp quân thù.',
    lore: 'Khắc ghi hào khí Đông A oanh liệt, nơi hàng vạn tướng sĩ Trần triều đồng thanh hô vang "Sát Thát", quét sạch 3 cuộc xâm lăng của vó ngựa Mông Cổ.',
    statsBonus: { hp: 320, attack: 55, defense: 50 },
    color: '#7f1d1d',
    secondaryColor: '#f59e0b',
    icon: '🛡️',
    pixelDesign: 'giap_tru',
    unlocked: false,
  },
  {
    id: 'hoang_bao_long_van',
    name: 'Hoàng Bào Long Vân Đại Thần',
    category: 'costume',
    dynastyOrRegion: 'Báu Vật Vĩnh Cửu Ngàn Năm',
    description: 'Bộ cổ phục hoàng gia tối thượng thêu chỉ vàng 24K hình Rồng bay uốn lượn mây trời ngậm ngọc minh châu sáng bừng thiên địa.',
    lore: 'Tụ hội tinh hoa của ngàn năm văn hiến, có sức mạnh xua tan mọi tà khí lãng quên và hồi sinh trọn vẹn ký ức văn hóa cho thế hệ mai sau.',
    statsBonus: { hp: 500, attack: 85, defense: 75, expBonus: 50 },
    color: '#b45309',
    secondaryColor: '#fef08a',
    icon: '🐉',
    pixelDesign: 'hoang_bao',
    unlocked: false,
  },
  // =========================================================================
  // BINH KHÍ CỔ TRUYỀN ĐẠI VIỆT (VŨ KHÍ NGÀY XƯA & BÁU VẬT TIỆM RÈN)
  // =========================================================================
  {
    id: 'riu_dong_dong_son',
    name: 'Rìu Đồng Đông Sơn',
    category: 'weapon',
    dynastyOrRegion: 'Thời Đại Hùng Vương (Văn Hóa Đông Sơn)',
    description: 'Rìu xòe cân chế tác từ đồng thau thượng hạng, lưỡi rìu đúc hình chim Lạc sải cánh và cảnh người chèo thuyền Lạc Việt săn bắn.',
    lore: 'Bảo vật chiến đấu và quyền uy của các Lạc Tướng thời vua Hùng dựng nước Văn Lang. Mỗi nhát bổ mang sức mạnh khai hoang lập ấp ngàn xưa.',
    statsBonus: { attack: 28, hp: 50 },
    color: '#d97706',
    secondaryColor: '#78350f',
    icon: '🪓',
    pixelDesign: 'bronze_axe',
    unlocked: false,
    price: 200,
  },
  {
    id: 'kiem_thuan_thien',
    name: 'Bảo Kiếm Thuận Thiên',
    category: 'weapon',
    dynastyOrRegion: 'Thời Lê Thái Tổ (Hồ Hoàn Kiếm)',
    description: 'Thanh gươm thần phát ra ánh kim quang rực rỡ, chuôi nạm ngọc bích, lưỡi kiếm khắc hai chữ "Thuận Thiên" thuận theo mệnh trời cứu quốc.',
    lore: 'Đức Long Quân trao gươm báu cho Lê Lợi tại Lam Sơn để khởi nghĩa quét sạch 20 vạn quân Minh, sau đó trả kiếm cho Rùa Vàng tại hồ Tả Vọng.',
    statsBonus: { attack: 55, hp: 80, expBonus: 20 },
    color: '#f59e0b',
    secondaryColor: '#fef08a',
    icon: '⚔️',
    pixelDesign: 'sacred_sword',
    unlocked: false,
    price: 600,
  },
  {
    id: 'no_than_kim_quy',
    name: 'Nỏ Thần Kim Quy (Liên Châu)',
    category: 'weapon',
    dynastyOrRegion: 'Thời An Dương Vương (Thành Cổ Loa)',
    description: 'Cung nỏ thần cơ bằng gỗ lim bọc đồng, lẫy nỏ chế tác theo móng rùa vàng của thần Kim Quy, bắn một phát bay ra muôn mũi tên đồng.',
    lore: 'Kỳ tích quân sự cổ thành Cổ Loa, hàng vạn mũi tên đồng Cầu Vực từng khiến quân xâm lược Triệu Đà khiếp sợ trước uy linh đất Việt.',
    statsBonus: { attack: 42, expBonus: 15 },
    color: '#059669',
    secondaryColor: '#34d399',
    icon: '🏹',
    pixelDesign: 'crossbow_sacred',
    unlocked: false,
    price: 450,
  },
  {
    id: 'thuong_bup_sen',
    name: 'Thương Ngọn Búp Sen Thần Tốc',
    category: 'weapon',
    dynastyOrRegion: 'Triều Đại Nhà Trần (Hào Khí Đông A)',
    description: 'Mũi thương thép hình búp sen nở tinh xảo, cán bọc đồng đỏ khắc chữ "Sát Thát", đâm xuyên mọi giáp trụ của quân thù.',
    lore: 'Vũ khí cận chiến của kỵ binh và bộ binh Trần Hưng Đạo trong 3 trận đại thắng Nguyên Mông lẫy lừng sông Bạch Đằng và Hàm Tử.',
    statsBonus: { attack: 36, hp: 70, defense: 10 },
    color: '#dc2626',
    secondaryColor: '#fca5a5',
    icon: '🔱',
    pixelDesign: 'lotus_spear',
    unlocked: false,
    price: 380,
  },
  {
    id: 'dai_dao_tay_son',
    name: 'Đại Đao Áo Vải Tây Sơn',
    category: 'weapon',
    dynastyOrRegion: 'Nghĩa Quân Tây Sơn (Vua Quang Trung)',
    description: 'Trường đao thép tôi lạnh bén ngót, thân đao nặng trịch chém đứt sắt thép, biểu trưng cho khí phách thần tốc dũng mãnh.',
    lore: 'Theo chân đoàn quân áo vải cờ đào từ Quy Nhơn tiến ra Thăng Long mùa xuân Kỷ Dậu 1789, đập tan 29 vạn quân Thanh trong 5 ngày.',
    statsBonus: { attack: 46, defense: 12 },
    color: '#991b1b',
    secondaryColor: '#fbbf24',
    icon: '🗡️',
    pixelDesign: 'tayson_blade',
    unlocked: false,
    price: 420,
  },
  {
    id: 'thiet_con_nam_bo',
    name: 'Thiết Côn Trầm Hương Nam Bộ',
    category: 'weapon',
    dynastyOrRegion: 'Nam Bộ Thời Khai Hoang Mở Cõi',
    description: 'Gậy côn đẽo từ gỗ mun trầm hương già rừng bọc đai sắt hai đầu, dẻo dai khôn lường tựa như lòng kiên cường của người phương Nam.',
    lore: 'Người tiền nhân Nam Bộ dùng gậy tầm vông và thiết côn để chống chọi thú dữ, bảo vệ làng mạc và khai phá ruộng đồng phì nhiêu.',
    statsBonus: { attack: 30, defense: 18, hp: 40 },
    color: '#365314',
    secondaryColor: '#bef264',
    icon: '🦯',
    pixelDesign: 'iron_staff',
    unlocked: false,
    price: 280,
  },
  // VẬT PHẨM LINH DƯỢC & BẢO VẬT TIỆM RÈN
  {
    id: 'binh_linh_duoc',
    name: 'Bình Ngọc Linh Dược',
    category: 'relic',
    dynastyOrRegion: 'Dược Liệu Cổ Truyền',
    description: 'Bình thuốc sắc từ nấm linh chi đỏ và sâm ngọc linh quý hiếm, giúp hồi phục ngay lập tức sinh lực dồi dào.',
    lore: 'Phương thuốc bí truyền gìn giữ thể lực dẻo dai cho quân sĩ trước giờ xung trận.',
    statsBonus: { hp: 60 },
    color: '#059669',
    secondaryColor: '#6ee7b7',
    icon: '🧪',
    pixelDesign: 'herb_potion',
    unlocked: false,
    price: 50,
  },
  {
    id: 'tra_sen_cung_dinh',
    name: 'Trà Sen Cung Đình Huế',
    category: 'relic',
    dynastyOrRegion: 'Ngự Trà Triều Nguyễn',
    description: 'Trà ướp hương hoa sen hồ Tịnh Tâm lúc rạng đông, thanh lọc cơ thể và phục hồi toàn diện nội lực.',
    lore: 'Thức uống tao nhã của bậc vua chúa, ướp từng hạt gạo sen thơm ngát thấm đượm sương sớm Cố Đô.',
    statsBonus: { hp: 100, expBonus: 10 },
    color: '#ec4899',
    secondaryColor: '#fbcfe8',
    icon: '🫖',
    pixelDesign: 'lotus_tea',
    unlocked: false,
    price: 90,
  },
  {
    id: 'bua_trong_dong',
    name: 'Bùa Hộ Mệnh Trống Đồng Ngọc Lũ',
    category: 'relic',
    dynastyOrRegion: 'Bảo Vật Quốc Gia',
    description: 'Mề đay đồng khắc họa tiết Mặt Trời 14 tia và đàn chim Lạc, gia tăng vĩnh viễn sức chống chịu giáp trụ.',
    lore: 'Âm vang trống đồng xua đuổi tà ma và che chở cho người giữ gìn ngọn lửa văn hóa Việt Nam.',
    statsBonus: { defense: 16, hp: 80 },
    color: '#b45309',
    secondaryColor: '#fde047',
    icon: '🛡️',
    pixelDesign: 'dong_son_talisman',
    unlocked: false,
    price: 320,
  },
  {
    id: 'linh_dan_fansipan',
    name: 'Linh Đan Đỉnh Fansipan',
    category: 'relic',
    dynastyOrRegion: 'Nóc Nhà Đông Dương',
    description: 'Viên đan dược kết tinh từ sương tuyết và linh khí ngàn năm trên đỉnh Fansipan hùng vĩ, tăng vĩnh viễn sức tấn công.',
    lore: 'Hấp thụ tinh hoa của trời đất Hoàng Liên Sơn, bồi đắp dũng khí phi thường cho người du hành.',
    statsBonus: { attack: 15, hp: 50 },
    color: '#2563eb',
    secondaryColor: '#93c5fd',
    icon: '💊',
    pixelDesign: 'fansipan_pill',
    unlocked: false,
    price: 400,
  },
  // =========================================================================
  // PHỤ KIỆN VĂN HÓA & TRANG SỨC CỔ TRUYỀN (STUDIO & TIỆM BẢO VẬT)
  // =========================================================================
  {
    id: 'acc_kieng_bac',
    name: 'Kiềng Bạc Chạm Hoa Sen Cổ',
    category: 'accessory',
    dynastyOrRegion: 'Đồng Bằng Bắc Bộ & Cung Đình',
    description: 'Chiếc kiềng bạc sáng bóng chạm khắc hoa sen thanh khiết, biểu tượng trang nhã đoan chính của phụ nữ Việt.',
    lore: 'Vật phẩm gia truyền trao tặng trong ngày cưới và các dịp lễ trọng đại, trừ tà khí và tôn vinh nét đài các.',
    statsBonus: { defense: 15, hp: 50 },
    color: '#e2e8f0',
    secondaryColor: '#94a3b8',
    icon: '⭕',
    pixelDesign: 'silver_collar',
    unlocked: true,
    price: 180,
  },
  {
    id: 'acc_quat_lua',
    name: 'Quạt Lụa Thêu Sen Bách Diệp',
    category: 'accessory',
    dynastyOrRegion: 'Làng Lụa Vạn Phúc & Cố Đô',
    description: 'Nan tre vót chuốt tỉ mỉ, mặt quạt lụa tơ tằm thêu hoa sen Tây Hồ, mang phong thái tao nhã e ấp của tao nhân mặc khách.',
    lore: 'Dùng xua tan oi bức mùa hè, che nét thẹn thùng và ngâm vịnh thi ca chốn văn hoa.',
    statsBonus: { attack: 12, defense: 8 },
    color: '#f472b6',
    secondaryColor: '#fbcfe8',
    icon: '🪭',
    pixelDesign: 'silk_fan',
    unlocked: true,
    price: 150,
  },
  {
    id: 'acc_tram_cai',
    name: 'Trâm Cài Tóc Ngọc Bích',
    category: 'accessory',
    dynastyOrRegion: 'Triều Nguyễn - Cung Đình Huế',
    description: 'Trâm bạc cẩn ngọc xanh biếc cài sau búi tóc trần đoan trang, vật đính ước son sắt trong thi ca cổ điển.',
    lore: 'Ngọc bích mang lại an nhiên thanh tịnh cho tâm hồn, gìn giữ khí chất thanh cao thoát tục.',
    statsBonus: { hp: 70, expBonus: 12 },
    color: '#34d399',
    secondaryColor: '#059669',
    icon: '🗡️',
    pixelDesign: 'jade_hairpin',
    unlocked: false,
    price: 220,
  },
  {
    id: 'acc_tui_gam',
    name: 'Túi Gấm Thêu Cánh Phượng',
    category: 'accessory',
    dynastyOrRegion: 'Thời Lê Sơ & Nguyễn Triều',
    description: 'Túi thơm gấm điều thêu chỉ vàng đựng xạ hương ngào ngạt hoặc tiền cổ may mắn, thắt ngang dải lụa cổ phục.',
    lore: 'Mùi hương trầm dịu nhẹ giữ cho tinh thần luôn tỉnh táo và xua đuổi những nhiễu loạn của mã độc thời gian.',
    statsBonus: { hp: 60, defense: 10 },
    color: '#ef4444',
    secondaryColor: '#fde047',
    icon: '👛',
    pixelDesign: 'brocade_pouch',
    unlocked: false,
    price: 160,
  },
  {
    id: 'acc_guoc_moc',
    name: 'Guốc Mộc Quai Gấm Thêu',
    category: 'accessory',
    dynastyOrRegion: 'Làng Nghề Guốc Yên Xá - Hà Nội',
    description: 'Đẽo từ gỗ mít già mộc mạc, đế son, quai gấm hoa văn ngũ sắc, tiếng gõ lách cách thân thương trên ngõ gạch.',
    lore: 'Đôi guốc mộc đồng hành cùng chiếc áo dài, áo tứ thân qua bao thăng trầm lịch sử.',
    statsBonus: { defense: 12, hp: 40 },
    color: '#b45309',
    secondaryColor: '#fed7aa',
    icon: '👡',
    pixelDesign: 'wooden_clogs',
    unlocked: true,
    price: 130,
  },
  {
    id: 'acc_chuoi_ngoc',
    name: 'Chuỗi Ngọc Bội Hoàng Cung',
    category: 'accessory',
    dynastyOrRegion: 'Phẩm Vật Quý Tộc Cung Khuyết',
    description: 'Chuỗi ngọc bội đeo bên vạt áo, bước đi ngọc khua thanh thoát báo hiệu cốt cách thanh cao của bậc quân tử.',
    lore: 'Biểu trưng cho ngũ đức: Nhân, Lễ, Nghĩa, Trí, Tín của con người đất Việt ngàn đời.',
    statsBonus: { hp: 110, attack: 18, defense: 18, expBonus: 15 },
    color: '#10b981',
    secondaryColor: '#a7f3d0',
    icon: '📿',
    pixelDesign: 'royal_jade_pendant',
    unlocked: false,
    price: 350,
  },
];

export const REGIONS_DATA: RegionLocation[] = [
  {
    id: 'mien_bac',
    name: 'Thăng Long - Kinh Bắc',
    vietnameseName: 'Hà Nội & Bắc Bộ',
    subTitle: 'Nôi Ngàn Năm Văn Hiến',
    description: 'Hoàng Thành Thăng Long cổ kính, làng lụa Vạn Phúc bảng lảng khói chiều và tiếng hát Quan họ ngọt ngào xứ Kinh Bắc.',
    mapX: 48,
    mapY: 22,
    recommendedLevel: 1,
    bgTheme: 'north',
    unlocked: true,
    landmark: 'Hoàng Thành Thăng Long & Chùa Một Cột',
    specialtyCloth: 'Áo Tứ Thân, Nón Quai Thao, Áo Giao Lĩnh',
    subAreas: [
      {
        id: 'mien_bac_nha_co',
        name: 'Làng Cổ Đại Việt (Nhà 5 Gian)',
        subTitle: 'Nếp Nhà Cổ Truyền Ngói Mũi Hài',
        description: 'Sân gạch Bát Tràng, bụi chuối tiêu trĩu buồng, chum nước mưa và hàng cột lim vững chãi.',
        sceneryType: 'ancient_house',
        width: 1200,
        height: 800,
        spawnPoint: { x: 500, y: 440 },
        portals: [
          { targetSubAreaId: 'mien_bac_hoang_thanh', portalName: '⛩️ CỔNG QUA HOÀNG THÀNH THĂNG LONG', x: 1120, y: 400, w: 70, h: 100 },
          { targetSubAreaId: 'mien_bac_van_phuc', portalName: '🌸 ĐƯỜNG VỀ LÀNG LỤA VẠN PHÚC', x: 80, y: 400, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_cu_do', name: 'Cụ Đồ Nguyễn Khoa', x: 420, y: 360, avatar: '👴', role: 'Trưởng lão Văn Miếu' },
        ],
        chests: [
          { id: 'chest_nb_1', x: 260, y: 460, rewardItemId: 'non_quai_thao', gold: 150, opened: false },
        ],
        interactables: [
          { id: 'prop_jar', name: 'Chum Sành Nước Mưa', badge: '💧 MÚC NƯỚC', x: 240, y: 320, dialogue: ['Bạn múc một gáo nước mưa thanh khiết từ chum sành cổ. Hồi phục 40 HP!'], healHp: 40 },
          { id: 'prop_banana', name: 'Rặng Chuối Tiêu', badge: '🍌 BỤI CHUỐI', x: 860, y: 320, dialogue: ['"Trước cau sau chuối" - triết lý phong thủy ngàn đời của nếp nhà người Việt.'] },
          { id: 'prop_wood', name: 'Đống Củi Gỗ', badge: '🪵 ĐỐNG CỦI', x: 820, y: 420, dialogue: ['Những thanh củi khô chuẩn bị cho nồi bánh chưng ngày Tết ấm cúng.'] },
        ]
      },
      {
        id: 'mien_bac_hoang_thanh',
        name: 'Hoàng Thành Thăng Long & Chùa Một Cột',
        subTitle: 'Kinh Kỳ Ngàn Năm Vương Khí',
        description: 'Cổng Đoan Môn sừng sững, hồ sen Chùa Một Cột thanh tịnh và đôi rồng đá thời Lý uy nghiêm.',
        sceneryType: 'citadel_north',
        width: 1200,
        height: 800,
        spawnPoint: { x: 600, y: 550 },
        portals: [
          { targetSubAreaId: 'mien_bac_nha_co', portalName: '🏡 VỀ LÀNG CỔ ĐẠI VIỆT', x: 80, y: 550, w: 70, h: 100 },
          { targetSubAreaId: 'mien_bac_van_phuc', portalName: '🧵 QUA LÀNG LỤA VẠN PHÚC', x: 1120, y: 550, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_tuong_quan', name: 'Thống Soái Lê Đại', x: 660, y: 300, avatar: '⚔️', role: 'Tướng thủ thành' },
        ],
        chests: [
          { id: 'chest_nb_2', x: 880, y: 420, rewardItemId: 'ao_giao_linh', gold: 220, opened: false },
        ],
        interactables: [
          { id: 'prop_pagoda', name: 'Chùa Một Cột', badge: '🪷 HỒ SEN CHÙA', x: 220, y: 230, dialogue: ['Đóa hoa sen ngàn năm giữa lòng thủ đô, biểu tượng của sự thanh cao và trí tuệ Phật giáo thời Lý.'] },
          { id: 'prop_doan_mon', name: 'Cổng Đoan Môn', badge: '🏰 CỔNG THÀNH', x: 660, y: 220, dialogue: ['Cổng thành Thăng Long nơi vua và triều thần cử hành các nghi lễ trọng đại của đất nước.'] },
        ]
      },
      {
        id: 'mien_bac_van_phuc',
        name: 'Làng Lụa Cổ Truyền Vạn Phúc',
        subTitle: 'Nắng Vàng Dệt Sợi Tơ Vương',
        description: 'Những giàn lụa ngũ sắc tung bay trong gió, tiếng khung cửi lách cách từ ngàn đời.',
        sceneryType: 'silk_village',
        width: 1200,
        height: 800,
        spawnPoint: { x: 400, y: 460 },
        portals: [
          { targetSubAreaId: 'mien_bac_nha_co', portalName: '🏡 VỀ LÀNG CỔ ĐẠI VIỆT', x: 80, y: 460, w: 70, h: 100 },
          { targetSubAreaId: 'mien_bac_hoang_thanh', portalName: '⛩️ QUA HOÀNG THÀNH THĂNG LONG', x: 1120, y: 460, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_ba_ba', name: 'Nghệ Nhân Dệt Lụa Thu Cúc', x: 480, y: 400, avatar: '👵', role: 'Nghệ nhân Vạn Phúc' },
        ],
        chests: [
          { id: 'chest_nb_3', x: 920, y: 360, rewardItemId: 'non_la', gold: 180, opened: false },
        ],
        interactables: [
          { id: 'prop_silk_rack', name: 'Giàn Lụa Ngũ Sắc', badge: '✨ XƯỞNG LỤA', x: 500, y: 220, dialogue: ['Lụa Vạn Phúc mềm mại, mỏng nhẹ mà bền đẹp, từng là cống phẩm hoàng triều bậc nhất.'] },
        ]
      }
    ],
    npcs: [
      { id: 'npc_ba_ba', name: 'Nghệ Nhân Dệt Lụa Thu Cúc', x: 280, y: 180, avatar: '👵', role: 'Nghệ nhân Vạn Phúc' },
      { id: 'npc_cu_do', name: 'Cụ Đồ Nguyễn Khoa', x: 520, y: 320, avatar: '👴', role: 'Trưởng lão Văn Miếu' },
      { id: 'npc_tuong_quan', name: 'Thống Soái Lê Đại', x: 700, y: 160, avatar: '⚔️', role: 'Tướng thủ thành' }
    ],
    chests: [
      { id: 'chest_nb_1', x: 160, y: 380, rewardItemId: 'non_quai_thao', gold: 120, opened: false },
      { id: 'chest_nb_2', x: 620, y: 460, rewardItemId: 'ao_giao_linh', gold: 200, opened: false }
    ]
  },
  {
    id: 'mien_trung',
    name: 'Cố Đô Huế & Đà Nẵng',
    vietnameseName: 'Kinh Kỳ Miền Trung',
    subTitle: 'Dấu Tích Hoàng Triều & Bến Ngự',
    description: 'Thành quách Ngọ Môn sừng sững bên dòng Hương Giang thơ mộng, nơi lưu giữ tinh hoa nhã nhạc và trang phục cung đình tuyệt đỉnh.',
    mapX: 52,
    mapY: 48,
    recommendedLevel: 3,
    bgTheme: 'central',
    unlocked: true,
    landmark: 'Ngọ Môn Cung Đình & Cầu Tràng Tiền',
    specialtyCloth: 'Áo Nhật Bình, Nón Bài Thơ, Áo Ngũ Thân',
    subAreas: [
      {
        id: 'mien_trung_dai_noi',
        name: 'Đại Nội Huế & Ngọ Môn',
        subTitle: 'Lầu Ngũ Phụng Vàng Son Cung Điện',
        description: 'Lầu Ngũ Phụng sơn son thếp vàng, hồ sen Thái Dịch và 5 cửa Ngọ Môn uy nghiêm.',
        sceneryType: 'imperial_hue',
        width: 1200,
        height: 800,
        spawnPoint: { x: 600, y: 620 },
        portals: [
          { targetSubAreaId: 'mien_trung_song_huong', portalName: '🛶 RA BẾN NGỰ SÔNG HƯƠNG', x: 1120, y: 550, w: 70, h: 100 },
          { targetSubAreaId: 'mien_trung_hoi_an', portalName: '🏮 VỀ PHỐ CỔ HỘI AN', x: 80, y: 550, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_quan_ngu_y', name: 'Thượng Thư Lễ Bộ', x: 680, y: 380, avatar: '📜', role: 'Trưởng ban điển lễ' }
        ],
        chests: [
          { id: 'chest_mt_2', x: 840, y: 520, rewardItemId: 'ao_nhat_binh', gold: 350, opened: false }
        ],
        interactables: [
          { id: 'prop_ngo_mon', name: 'Cửa Ngọ Môn', badge: '👑 NGỌ MÔN', x: 600, y: 280, dialogue: ['Cửa chính giữa Ngọ Môn chỉ dành riêng cho Thiên Tử triều Nguyễn ngự lãm.'] },
        ]
      },
      {
        id: 'mien_trung_song_huong',
        name: 'Bến Ngự Sông Hương & Thuyền Rồng',
        subTitle: 'Dòng Hương Giang Thơ Mộng Bến Bờ Ca Huế',
        description: 'Dòng sông êm đềm, thuyền rồng ca Huế và cầu Tràng Tiền lấp lánh bóng nước.',
        sceneryType: 'river_hue',
        width: 1200,
        height: 800,
        spawnPoint: { x: 450, y: 240 },
        portals: [
          { targetSubAreaId: 'mien_trung_dai_noi', portalName: '👑 VÀO ĐẠI NỘI HUẾ', x: 80, y: 240, w: 70, h: 100 },
          { targetSubAreaId: 'mien_trung_hoi_an', portalName: '🏮 QUA PHỐ CỔ HỘI AN', x: 1120, y: 240, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_hue_nghe_nhan', name: 'Mệ Tôn Nữ Diệu Tâm', x: 380, y: 220, avatar: '🧕', role: 'Nghệ nhân Nón Bài Thơ' }
        ],
        chests: [
          { id: 'chest_mt_1', x: 260, y: 220, rewardItemId: 'non_bai_tho', gold: 250, opened: false }
        ],
        interactables: [
          { id: 'prop_boat', name: 'Thuyền Rồng Cung Đình', badge: '🐉 THUYỀN RỒNG', x: 580, y: 440, dialogue: ['Thuyền rồng lộng lẫy nơi các nghệ nhân diễn xướng Nhã Nhạc Cung Đình Huế và ca trù xứ Huế.'] }
        ]
      },
      {
        id: 'mien_trung_hoi_an',
        name: 'Phố Cổ Hội An & Đèn Lồng Hoa Đăng',
        subTitle: 'Hoài Niệm Phố Hội Lung Linh Sắc Màu',
        description: 'Tường vàng hoa cau, mái ngói âm dương rêu phong và hàng trăm lồng đèn huyền ảo.',
        sceneryType: 'hoian_lantern',
        width: 1200,
        height: 800,
        spawnPoint: { x: 500, y: 450 },
        portals: [
          { targetSubAreaId: 'mien_trung_dai_noi', portalName: '👑 VỀ ĐẠI NỘI HUẾ', x: 80, y: 450, w: 70, h: 100 },
          { targetSubAreaId: 'mien_trung_song_huong', portalName: '🛶 RA BẾN SÔNG HƯƠNG', x: 1120, y: 450, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_hoian_tho', name: 'Nghệ Nhân Lồng Đèn Phố Hội', x: 620, y: 380, avatar: '🏮', role: 'Nghệ nhân đèn lồng' }
        ],
        chests: [
          { id: 'chest_mt_3', x: 820, y: 440, rewardItemId: 'ao_ngu_than', gold: 300, opened: false }
        ]
      }
    ],
    npcs: [
      { id: 'npc_hue_nghe_nhan', name: 'Mệ Tôn Nữ Diệu Tâm', x: 340, y: 220, avatar: '🧕', role: 'Nghệ nhân Nón Bài Thơ' },
      { id: 'npc_quan_ngu_y', name: 'Thượng Thư Lễ Bộ', x: 600, y: 260, avatar: '📜', role: 'Trưởng ban điển lễ' }
    ],
    chests: [
      { id: 'chest_mt_1', x: 220, y: 140, rewardItemId: 'non_bai_tho', gold: 250, opened: false },
      { id: 'chest_mt_2', x: 580, y: 420, rewardItemId: 'ao_nhat_binh', gold: 350, opened: false }
    ]
  },
  {
    id: 'tay_nguyen',
    name: 'Đại Ngàn Tây Nguyên',
    vietnameseName: 'Đại Ngàn & Sử Thi Hùng Vĩ',
    subTitle: 'Âm Vang Cồng Chiêng & Rừng Già',
    description: 'Nhà rông cao vút giữa bạt ngàn hoa dã quỳ và tiếng cồng chiêng vang vọng khắp buôn làng cùng ngọn lửa thiêng huyền thoại.',
    mapX: 42,
    mapY: 62,
    recommendedLevel: 5,
    bgTheme: 'highland',
    unlocked: true,
    landmark: 'Nhà Rông Buôn Đôn & Thác Dray Nur',
    specialtyCloth: 'Thổ Cẩm Hoa Văn Đại Ngàn',
    subAreas: [
      {
        id: 'tay_nguyen_nha_rong',
        name: 'Buôn Đôn & Nhà Rông Hùng Vĩ',
        subTitle: 'Trái Tim Buôn Làng & Ngọn Lửa Thiêng',
        description: 'Nhà Rông cao vút mái nhọn như lưỡi búa, bếp lửa thiêng sưởi ấm tâm hồn đồng bào.',
        sceneryType: 'highland_rong',
        width: 1200,
        height: 800,
        spawnPoint: { x: 550, y: 580 },
        portals: [
          { targetSubAreaId: 'tay_nguyen_thac_nuoc', portalName: '🌊 QUA THÁC NƯỚC DRAY NUR', x: 1120, y: 550, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_gia_lang', name: 'Già Làng Y-Bham', x: 420, y: 480, avatar: '🧓', role: 'Già làng Buôn Đôn' },
          { id: 'npc_thieu_nu_tn', name: 'Thiếu Nữ H’Hen', x: 740, y: 480, avatar: '🌺', role: 'Thợ dệt thổ cẩm' }
        ],
        chests: [
          { id: 'chest_tn_1', x: 260, y: 520, rewardItemId: 'tho_cam_tay_nguyen', gold: 400, opened: false }
        ],
        interactables: [
          { id: 'prop_fire', name: 'Ngọn Lửa Thiêng Buôn Làng', badge: '🔥 LỬA THIÊNG', x: 600, y: 500, dialogue: ['Ngọn lửa bập bùng tượng trưng cho sức sống mãnh liệt và tinh thần đoàn kết bất diệt của đại ngàn.'] }
        ]
      },
      {
        id: 'tay_nguyen_thac_nuoc',
        name: 'Đại Ngàn Thác Dray Nur & Rừng Kơ-Nia',
        subTitle: 'Thác Nước Hùng Vĩ & Cây Kơ-Nia Ngàn Năm',
        description: 'Dòng thác bạc đổ bọt trắng xóa giữa vách đá basalt và rặng rừng già.',
        sceneryType: 'highland_waterfall',
        width: 1200,
        height: 800,
        spawnPoint: { x: 300, y: 580 },
        portals: [
          { targetSubAreaId: 'tay_nguyen_nha_rong', portalName: '🏕️ VỀ BUÔN ĐÔN & NHÀ RÔNG', x: 80, y: 550, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_tho_san', name: 'Tráng Sĩ Ama-Kông', x: 620, y: 560, avatar: '🏹', role: 'Thợ săn voi rừng' }
        ],
        chests: [
          { id: 'chest_tn_2', x: 880, y: 560, rewardItemId: 'tho_cam_tay_nguyen', gold: 450, opened: false }
        ]
      }
    ],
    npcs: [
      { id: 'npc_gia_lang', name: 'Già Làng Y-Bham', x: 380, y: 260, avatar: '🧓', role: 'Già làng Buôn Đôn' },
      { id: 'npc_thieu_nu_tn', name: 'Thiếu Nữ H’Hen', x: 560, y: 190, avatar: '🌺', role: 'Thợ dệt thổ cẩm' }
    ],
    chests: [
      { id: 'chest_tn_1', x: 240, y: 390, rewardItemId: 'tho_cam_tay_nguyen', gold: 400, opened: false }
    ]
  },
  {
    id: 'mien_nam',
    name: 'Gia Định & Sông Cửu Long',
    vietnameseName: 'Nam Bộ Phù Sa',
    subTitle: 'Sông Nước Cửu Long & Chợ Nổi',
    description: 'Vùng đất phương Nam phì nhiêu phù sa, rặng dừa nước soi bóng và tiếng đờn ca tài tử dìu dặt bến phà.',
    mapX: 38,
    mapY: 82,
    recommendedLevel: 7,
    bgTheme: 'south',
    unlocked: true,
    landmark: 'Chợ Bến Thành Cổ & Chợ Nổi Cái Răng',
    specialtyCloth: 'Áo Bà Ba & Khăn Rằn Nam Bộ',
    subAreas: [
      {
        id: 'mien_nam_cho_noi',
        name: 'Chợ Nổi Cái Răng & Bến Thuyền Phù Sa',
        subTitle: 'Sông Nước Hào Sảng Ghe Xuồng Tấp Nập',
        description: 'Ghe xuồng bồng bềnh, cây bẹo treo khóm bưởi và rặng dừa nước bát ngát.',
        sceneryType: 'south_floating_market',
        width: 1200,
        height: 800,
        spawnPoint: { x: 500, y: 400 },
        portals: [
          { targetSubAreaId: 'mien_nam_miet_vuon', portalName: '🌴 QUA MIỆT VƯỜN & CẦU KHỈ', x: 1120, y: 400, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_ba_ba_nam', name: 'Má Bảy Sông Tiền', x: 420, y: 360, avatar: '👵', role: 'Chủ tiệm may Ba Ba' },
          { id: 'npc_bac_ba_phi', name: 'Bác Ba Phi', x: 740, y: 360, avatar: '🧔', role: 'Người kể chuyện Nam Bộ' }
        ],
        chests: [
          { id: 'chest_mn_1', x: 280, y: 420, rewardItemId: 'ao_ba_ba', gold: 450, opened: false }
        ]
      },
      {
        id: 'mien_nam_miet_vuon',
        name: 'Miệt Vườn Trái Cây & Cầu Khỉ Nam Bộ',
        subTitle: 'Nếp Nhà Ba Gian Lá Dừa Mộc Mạc',
        description: 'Cầu khỉ lắc lẻo bắc qua mương vườn sầu riêng, vú sữa trĩu quả thơm ngát.',
        sceneryType: 'south_orchard',
        width: 1200,
        height: 800,
        spawnPoint: { x: 300, y: 400 },
        portals: [
          { targetSubAreaId: 'mien_nam_cho_noi', portalName: '🛶 VỀ CHỢ NỔI CÁI RĂNG', x: 80, y: 400, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_don_ca', name: 'Nghệ Nhân Đờn Ca Tài Tử', x: 620, y: 380, avatar: '🪕', role: 'Nhạc sĩ tài tử' }
        ],
        chests: [
          { id: 'chest_mn_2', x: 850, y: 460, rewardItemId: 'ao_ngu_than', gold: 500, opened: false }
        ]
      }
    ],
    npcs: [
      { id: 'npc_ba_ba_nam', name: 'Má Bảy Sông Tiền', x: 310, y: 240, avatar: '👵', role: 'Chủ tiệm may Ba Ba' },
      { id: 'npc_bac_ba_phi', name: 'Bác Ba Phi', x: 580, y: 350, avatar: '🧔', role: 'Người kể chuyện Nam Bộ' }
    ],
    chests: [
      { id: 'chest_mn_1', x: 200, y: 300, rewardItemId: 'ao_ba_ba', gold: 450, opened: false },
      { id: 'chest_mn_2', x: 650, y: 200, rewardItemId: 'ao_ngu_than', gold: 500, opened: false }
    ]
  },
  {
    id: 'hai_dao',
    name: 'Quần Đảo Hoàng Sa & Trường Sa',
    vietnameseName: 'Hải Đảo Thiêng Liêng',
    subTitle: 'Hùng Binh Giữ Biển Đông',
    description: 'Biển xanh ngắt ngút ngàn, cột mốc chủ quyền thiêng liêng rạng rỡ và những cây bàng vuông kiên cường trước sóng gió.',
    mapX: 74,
    mapY: 65,
    recommendedLevel: 9,
    bgTheme: 'islands',
    unlocked: true,
    landmark: 'Bia Chủ Quyền Cổ & Cây Bàng Vuông',
    specialtyCloth: 'Chiến Bào Giáp Sắt Đại Việt',
    subAreas: [
      {
        id: 'hai_dao_bia_chu_quyen',
        name: 'Bia Chủ Quyền Hoàng Sa - Trường Sa',
        subTitle: 'Cương Vực Thiêng Liêng Tổ Quốc Biển Đông',
        description: 'Bia đá hoa cương đỏ thắm, cờ đỏ sao vàng tung bay và cây bàng vuông bão táp.',
        sceneryType: 'islands_milestone',
        width: 1200,
        height: 800,
        spawnPoint: { x: 600, y: 500 },
        portals: [
          { targetSubAreaId: 'hai_dao_hai_dang', portalName: '🗼 QUA HẢI ĐĂNG BIỂN ĐÔNG', x: 1120, y: 500, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_thuy_thu', name: 'Đội Trưởng Hải Quân Hoàng Sa', x: 480, y: 420, avatar: '⚓', role: 'Hùng binh giữ đảo' }
        ],
        chests: [
          { id: 'chest_hd_1', x: 750, y: 440, rewardItemId: 'giap_tru_dai_viet', gold: 800, opened: false }
        ]
      },
      {
        id: 'hai_dao_hai_dang',
        name: 'Ngọn Hải Đăng Cổ & Bãi San Hô',
        subTitle: 'Mắt Thần Biển Đêm Soi Đường Tổ Quốc',
        description: 'Tháp hải đăng cổ kính kiên cường soi sáng ngàn hải lý bảo vệ ngư dân và lãnh hải.',
        sceneryType: 'islands_lighthouse',
        width: 1200,
        height: 800,
        spawnPoint: { x: 400, y: 500 },
        portals: [
          { targetSubAreaId: 'hai_dao_bia_chu_quyen', portalName: '🇻🇳 VỀ BIA CHỦ QUYỀN ĐẢO', x: 80, y: 500, w: 70, h: 100 },
        ],
        npcs: [
          { id: 'npc_hai_dang', name: 'Người Gác Đèn Hải Đảo', x: 580, y: 460, avatar: '💡', role: 'Thủ tháp hải đăng' }
        ],
        chests: [
          { id: 'chest_hd_2', x: 800, y: 480, rewardItemId: 'hoang_bao_long_van', gold: 1000, opened: false }
        ]
      }
    ],
    npcs: [
      { id: 'npc_thuy_thu', name: 'Đội Trưởng Hải Quân Hoàng Sa', x: 400, y: 250, avatar: '⚓', role: 'Hùng binh giữ đảo' }
    ],
    chests: [
      { id: 'chest_hd_1', x: 280, y: 320, rewardItemId: 'giap_tru_dai_viet', gold: 800, opened: false }
    ]
  },
  {
    id: 'tam_linh_virus',
    name: 'Lãnh Địa Virus Lãng Quên',
    vietnameseName: 'Hư Không Ký Ức 2026',
    subTitle: 'Trận Chiến Quyết Định Vận Mệnh Văn Hóa (Trùm Cuối 2 Mạng)',
    description: 'Vùng không gian ma trận số hóa bị virus bóng tối bao trùm, nơi chứa nguồn cội của mã độc xóa ký ức văn hiến Việt Nam.',
    mapX: 50,
    mapY: 36,
    recommendedLevel: 10,
    bgTheme: 'void',
    unlocked: false,
    landmark: 'Hạch Tâm Lãng Quên (Core Glitch)',
    specialtyCloth: 'Hoàng Bào Long Vân Thần Thánh',
    subAreas: [
      {
        id: 'tam_linh_void',
        name: 'Hư Không Thời Gian & Hạch Tâm Virus',
        subTitle: 'Vùng Đất Vỡ Vụn Của Những Ký Ức Đã Mất',
        description: 'Nơi diễn ra trận quyết chiến với thể thức tối thượng của Virus Lãng Quên.',
        sceneryType: 'void_realm',
        width: 1200,
        height: 800,
        spawnPoint: { x: 600, y: 500 },
        portals: [],
        npcs: [],
        chests: [
          { id: 'chest_boss_1', x: 600, y: 300, rewardItemId: 'hoang_bao_long_van', gold: 2000, opened: false }
        ]
      }
    ],
    npcs: [],
    chests: [
      { id: 'chest_boss_1', x: 400, y: 300, rewardItemId: 'hoang_bao_long_van', gold: 2000, opened: false }
    ]
  }
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'q_non_la_van_phuc',
    title: 'Sợi Chỉ Ký Ức Thăng Long',
    regionId: 'mien_bac',
    npcName: 'Nghệ Nhân Dệt Lụa Thu Cúc',
    npcAvatar: '👵',
    npcDialogue: [
      'Chào con! Ta nghe nói con đến từ tương lai 2026 trên cỗ máy thời gian...',
      'Virus Lãng Quên đang ăn mòn ký ức của giới trẻ. Chúng vừa đánh cắp cuộn tơ tằm cổ và bản vẽ Nón Quai Thao!',
      'Con hãy dọn dẹp lũ Quái Nhiễm Khuẩn ngoài kia và thu hồi lại Nón Quai Thao giúp đất Thăng Long nhé!'
    ],
    completionDialogue: [
      'Kỳ diệu thay! Tinh hoa Kinh Bắc đã được hồi sinh!',
      'Chiếc Nón Quai Thao này giờ là của con. Hãy mang nó đi khắp dải đất chữ S để đánh thức tâm hồn dân tộc!'
    ],
    objective: 'Đánh bại quái vật và mở rương báu tại Bắc Bộ',
    type: 'defeat_monsters',
    targetCount: 1,
    currentCount: 0,
    rewardExp: 150,
    rewardGold: 100,
    rewardItemId: 'non_quai_thao',
  },
  {
    id: 'q_hue_nhat_binh',
    title: 'Phụng Hoàng Cung Cấm',
    regionId: 'mien_trung',
    npcName: 'Mệ Tôn Nữ Diệu Tâm',
    npcAvatar: '🧕',
    npcDialogue: [
      'Gặp được người gánh vác sứ mệnh dân tộc nơi sông Hương thật quý giá...',
      'Áo Nhật Bình - biểu tượng đức hạnh và vẻ đẹp tôn nghiêm hoàng tộc triều Nguyễn đang bị phong ấn trong sương mù lãng quên.',
      'Hãy tìm chiếc Nón Bài Thơ và giải trừ u hồn để mở khóa linh khí Nhật Bình!'
    ],
    completionDialogue: [
      'Vạt áo ngũ sắc đã rạng ngời trở lại trong ánh chiều Cố Đô!',
      'Con xứng đáng khoác lên mình bảo vật Nhật Bình cao quý này!'
    ],
    objective: 'Tìm kiếm cổ vật Nón Bài Thơ và Áo Nhật Bình tại Huế',
    type: 'find_item',
    targetCount: 1,
    currentCount: 0,
    rewardExp: 300,
    rewardGold: 250,
    rewardItemId: 'ao_nhat_binh',
  },
  {
    id: 'q_tay_nguyen_tho_cam',
    title: 'Ngọn Lửa Sử Thi Đăm Săn',
    regionId: 'tay_nguyen',
    npcName: 'Già Làng Y-Bham',
    npcAvatar: '🧓',
    npcDialogue: [
      'Ơi con trai / con gái dũng cảm! Đại ngàn Tây Nguyên đang nổi giông bão.',
      'Lũ Ma Sương đang gặm nhấm những khung dệt thổ cẩm của buôn làng!',
      'Hãy giúp già đánh lui tà khí trong rừng thiêng để tiếng cồng chiêng lại vang vọng!'
    ],
    completionDialogue: [
      'Hỡi linh hồn Yang và Đăm Săn! Ngọn lửa ký ức đã bừng sáng!',
      'Già làng tặng con bộ Thổ Cẩm dệt bằng tình yêu đại ngàn này!'
    ],
    objective: 'Vượt qua thử thách rừng già Tây Nguyên',
    type: 'defeat_monsters',
    targetCount: 1,
    currentCount: 0,
    rewardExp: 450,
    rewardGold: 300,
    rewardItemId: 'tho_cam_tay_nguyen',
  },
  {
    id: 'q_nam_bo_ba_ba',
    title: 'Hồn Quê Bến Nước Sông Tiền',
    regionId: 'mien_nam',
    npcName: 'Má Bảy Sông Tiền',
    npcAvatar: '👵',
    npcDialogue: [
      'Má ngóng con mãi từ ngoài kinh xáng vào!',
      'Áo Bà Ba và Khăn Rằn thấm đượm mồ hôi khai hoang mở cõi sắp bị Virus xóa sổ khỏi tâm trí con cháu rồi.',
      'Đi dạo qua các cù lao, dẹp sạch lũ thủy quái phù sa giúp má nghen!'
    ],
    completionDialogue: [
      'Đúng là hậu sinh khả úy! Áo Bà Ba mộc mạc mà chứa chan ân tình Nam Bộ!',
      'Má may riêng cho con bộ áo lụa và chiếc khăn rằn hiên ngang này nè!'
    ],
    objective: 'Giải cứu văn hóa sông nước Cửu Long',
    type: 'defeat_monsters',
    targetCount: 1,
    currentCount: 0,
    rewardExp: 600,
    rewardGold: 400,
    rewardItemId: 'ao_ba_ba',
  },
  {
    id: 'q_hai_dao_sat_that',
    title: 'Hào Khí Biển Đông & Giáp Trụ',
    regionId: 'hai_dao',
    npcName: 'Đội Trưởng Hải Quân Hoàng Sa',
    npcAvatar: '⚓',
    npcDialogue: [
      'Trời Nam một cõi thiêng liêng! Đội Hoàng Sa từ thời vua Lê, chúa Nguyễn đã dong buồm cưỡi sóng dữ đo đạc cắm mốc.',
      'Chiến bào Giáp Sắt Đại Việt năm xưa bảo vệ xã tắc ngàn đời trước ngoại xâm nay là vũ khí tối thượng.',
      'Hãy tiếp nhận bảo giáp này để chuẩn bị tiến đánh sào huyệt Virus Lãng Quên!'
    ],
    completionDialogue: [
      'Hào khí Đông A rực cháy trong tim con! Giờ con đã đủ bản lĩnh đương đầu với trùm cuối!'
    ],
    objective: 'Tiếp nhận Giáp Trụ Đại Việt tại quần đảo thiêng liêng',
    type: 'talk',
    rewardExp: 900,
    rewardGold: 600,
    rewardItemId: 'giap_tru_dai_viet',
  },
  {
    id: 'q_boss_ultimate',
    title: 'Trận Chiến Quyết Định: Xóa Bỏ Virus Lãng Quên',
    regionId: 'tam_linh_virus',
    npcName: 'Hạch Tâm Ký Ức 2026',
    npcAvatar: '⚡',
    npcDialogue: [
      'Ngươi đã hội tụ đủ trí tuệ và linh khí cổ phục trên khắp bản đồ chữ S...',
      'Nhưng Virus Lãng Quên là hiện thân của sự thờ ơ và thời gian hư vô.',
      'Hãy kích hoạt sức mạnh tối thượng để thanh tẩy mã độc, cứu lấy cội nguồn dân tộc!'
    ],
    completionDialogue: [
      'Virus Lãng Quên đã tan biến thành tro bụi số hóa!',
      'Ký ức ngàn năm của Việt Nam đã được vĩnh viễn ghi sâu vào trái tim thế hệ mai sau!'
    ],
    objective: 'Tiêu diệt Chúa Tể Virus Lãng Quên tại Hư Không',
    type: 'defeat_monsters',
    rewardExp: 3000,
    rewardGold: 2000,
    rewardItemId: 'hoang_bao_long_van',
  }
];

export const INITIAL_TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 't_1',
    category: 'Cổ phục',
    question: 'Áo Tứ Thân truyền thống có bao nhiêu vạt áo, và hai vạt trước thường được mặc như thế nào?',
    options: [
      '4 vạt: 2 vạt sau may liền sống lưng, 2 vạt trước buông tự do hoặc buộc lại với nhau',
      '4 vạt: 4 vạt hoàn toàn rời nhau không may dính sống lưng',
      '4 vạt: Cả 4 vạt đều may khép kín thành ống váy',
      '3 vạt: Tứ thân là tên gọi tượng trưng chứ chỉ có 3 mảnh vải'
    ],
    correctIndex: 0,
    explanation: 'Áo tứ thân gồm 4 vạt: 2 vạt sau may liền sống lưng tạo thành sống áo, 2 vạt trước để buông hoặc buộc lại trước bụng tạo nét duyên dáng, kín đáo.',
    difficulty: 'easy'
  },
  {
    id: 't_2',
    category: 'Cổ phục',
    question: 'Áo Nhật Bình dưới triều Nguyễn vốn là trang phục dành cho tầng lớp nào?',
    options: [
      'Dân thường và thương nhân buôn bán lớn',
      'Binh lính thủy quân và kỵ binh',
      'Hoàng Thái Hậu, Hoàng Hậu, Công Chúa và các bậc Phi Tần',
      'Các vị tú tài và quan huyện mới đỗ đạt'
    ],
    correctIndex: 2,
    explanation: 'Áo Nhật Bình là thường phục của các bậc cao quý trong hoàng cung triều Nguyễn (Hậu phi, Công chúa) với phần cổ áo hình chữ nhật đặc trưng và viền ngũ sắc rực rỡ.',
    difficulty: 'easy'
  },
  {
    id: 't_3',
    category: 'Văn hóa',
    question: 'Chiếc "Nón Bài Thơ" nổi tiếng xứ Huế có đặc điểm chế tác độc đáo nào?',
    options: [
      'Được sơn màu dạ quang phát sáng vào ban đêm',
      'Khi soi dưới ánh sáng sẽ thấy hiện lên bài thơ và hình vẽ phong cảnh chìm giữa 2 lớp lá',
      'Được bọc một lớp vàng thật mỏng quanh vành nón',
      'Được gắn chuông đồng nhỏ phát ra nhạc điệu khi đi bộ'
    ],
    correctIndex: 1,
    explanation: 'Nghệ nhân làng nón Tây Hồ (Huế) khéo léo chèn những câu thơ chữ Hán/Nôm hoặc chữ Quốc ngữ và hoa văn sông Hương núi Ngự giữa hai lớp lá gồi mỏng, chỉ khi soi lên ánh sáng mới thấy rõ.',
    difficulty: 'easy'
  },
  {
    id: 't_4',
    category: 'Lịch sử',
    question: 'Cổ áo "Giao Lĩnh" (phổ biến thời Lý - Trần - Lê) có kết cấu như thế nào?',
    options: [
      'Cổ áo tròn ôm sát cổ và cài nút bên vai',
      'Cổ áo có hai vạt giao chéo góc sang bên phải',
      'Cổ áo khoét sâu hình chữ V không vạt cài',
      'Cổ đứng thẳng cao 3 phân như áo dài tân thời'
    ],
    correctIndex: 1,
    explanation: 'Áo Giao Lĩnh (còn gọi là áo tràng trạt) có hai vạt cổ đan chéo nhau sang bên phải khi mặc, là trang phục cổ truyền tồn tại lâu đời trong văn hóa Đại Việt.',
    difficulty: 'medium'
  },
  {
    id: 't_5',
    category: 'Cổ phục',
    question: 'Tại sao chiếc Áo Ngũ Thân lại được xem là tiền thân trực tiếp của Áo Dài Việt Nam hiện đại?',
    options: [
      'Vì áo ngũ thân được may bằng vải nilon phương Tây',
      'Vì giữ nguyên cấu trúc cổ đứng, vạt áo dài qua gối và cải biên cách tân thành 2 vạt',
      'Vì do một nhà thiết kế người Pháp vẽ ra năm 1970',
      'Vì chỉ có phụ nữ mặc chứ nam giới không mặc bao giờ'
    ],
    correctIndex: 1,
    explanation: 'Áo ngũ thân thời chúa Nguyễn Phúc Khoát và vua Minh Mạng đã định hình cổ đứng, 5 nút cài bên phải, vạt dài. Đến thế kỷ 20, các họa sĩ Lemur Cát Tường cách tân thu gọn thành 2 vạt tạo nên Áo Dài hiện đại.',
    difficulty: 'medium'
  },
  {
    id: 't_6',
    category: 'Dệt may',
    question: 'Làng nghề dệt lụa Vạn Phúc (Hà Đông, Hà Nội) nổi tiếng với loại lụa truyền thống nào từng được vua chúa ưa chuộng?',
    options: [
      'Lụa Sa tanh công nghiệp',
      'Lụa Vân tơ tằm cổ truyền dệt hoa văn chìm nổi',
      'Vải nỉ ép sợi tổng hợp',
      'Lụa gấm thêu vi tính'
    ],
    correctIndex: 1,
    explanation: 'Lụa Vân Vạn Phúc nức tiếng gần xa vì dệt thủ công từ 100% tơ tằm tự nhiên, mỏng nhẹ, thoáng mát, hoa văn biến ảo lấp lánh khi có ánh sáng chiếu vào.',
    difficulty: 'medium'
  },
  {
    id: 't_7',
    category: 'Lịch sử',
    question: 'Hào khí "Đông A" gắn liền với triều đại nào trong lịch sử oai hùng của dân tộc Việt Nam?',
    options: [
      'Triều Tiền Lê',
      'Triều Nhà Trần',
      'Triều Nhà Mạc',
      'Triều Tây Sơn'
    ],
    correctIndex: 1,
    explanation: 'Chữ "Trần" (陳) chiết tự gồm chữ "Đông" (東) và chữ "A" (阿), do đó "Hào khí Đông A" chính là tinh thần quật cường, ba lần đại thắng quân Nguyên Mông của triều Trần.',
    difficulty: 'easy'
  },
  {
    id: 't_8',
    category: 'Văn hóa',
    question: 'Chiếc khăn rằn Nam Bộ thường có hoa văn và nguồn gốc giao thoa độc đáo nào?',
    options: [
      'Hoa văn rồng phượng thêu kim tuyến triều đình',
      'Họa tiết kẻ ô ca-rô vuông đen trắng hoặc đỏ trắng mộc mạc',
      'In hình phong cảnh hồ Gươm',
      'Sơn màu phản quang chống nắng'
    ],
    correctIndex: 1,
    explanation: 'Khăn rằn kẻ ca-rô mộc mạc là biểu tượng bất hủ của người dân Nam Bộ kiên cường, tiện lợi che nắng, thấm mồ hôi trên đồng ruộng và chiến hào.',
    difficulty: 'easy'
  },
  {
    id: 't_9',
    category: 'Cổ phục',
    question: 'Năm cúc áo trên chiếc Áo Ngũ Thân tượng trưng cho triết lý đạo đức nào của người xưa?',
    options: [
      'Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ)',
      'Ngũ Luân (Quân thần, Phụ tử, Phu thê, Huynh đệ, Bằng hữu) và Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín)',
      'Năm châu bốn biển',
      'Năm màu cờ ngũ sắc'
    ],
    correctIndex: 1,
    explanation: 'Năm chiếc cúc áo tượng trưng cho Ngũ thường: Nhân, Lễ, Nghĩa, Trí, Tín; đồng thời biểu trưng cho Ngũ luân, thể hiện phong thái giữ gìn phẩm hạnh của người quân tử.',
    difficulty: 'hard'
  },
  {
    id: 't_10',
    category: 'Dệt may',
    question: 'Người xưa ở đồng bằng Bắc Bộ thường nhuộm vải áo tứ thân, áo cánh màu nâu bằng nguyên liệu thiên nhiên nào?',
    options: [
      'Màu thực phẩm công nghiệp',
      'Củ nâu và bùn ao',
      'Nước luộc lá cải bó xôi',
      'Bột than tre hoạt tính'
    ],
    correctIndex: 1,
    explanation: 'Người xưa lấy nước củ nâu cạo vỏ giã nát để nhuộm vải, sau đó đem ngâm nhúng bùn ao phù sa sông Hồng để tạo nên màu nâu sồng bền màu và đượm hồn đất mẹ.',
    difficulty: 'medium'
  },
  {
    id: 't_11',
    category: 'Văn hóa',
    question: 'Bộ trang phục thổ cẩm truyền thống của các dân tộc Tây Nguyên (Ê-đê, Ba-na, Gia-rai) mang màu sắc chủ đạo nào?',
    options: [
      'Trắng tinh khôi và xanh lam nhạt',
      'Đen hoặc chàm sẫm kết hợp hoa văn đỏ, vàng, trắng nổi bật',
      'Màu hồng pastel và cam nhạt',
      'Màu xanh ngọc bích đơn sắc'
    ],
    correctIndex: 1,
    explanation: 'Trang phục thổ cẩm Tây Nguyên nổi bật với nền đen hoặc chàm đậm, điểm xuyết hoa văn rực rỡ màu đỏ của lửa, vàng của mặt trời tượng trưng cho sức sống mãnh liệt của đại ngàn.',
    difficulty: 'medium'
  },
  {
    id: 't_12',
    category: 'Lịch sử',
    question: 'Hải đội Hoàng Sa được thành lập từ thế kỷ nào để thực thi chủ quyền biển đảo thiêng liêng của Việt Nam?',
    options: [
      'Đầu thế kỷ 17 (thời chúa Nguyễn)',
      'Thế kỷ 20 sau chiến tranh thế giới thứ nhất',
      'Năm 1995 thời kỳ hội nhập',
      'Thế kỷ 10 thời Đinh Tiên Hoàng'
    ],
    correctIndex: 0,
    explanation: 'Hải đội Hoàng Sa được Chúa Nguyễn lập từ đầu thế kỷ 17 tại vương quốc Đàng Trong, hàng năm cử 70 suất lính dong buồm ra Hoàng Sa, Trường Sa đo vẽ hải đồ, thu lượm hải vật và cắm mốc chủ quyền.',
    difficulty: 'hard'
  }
];

export const INITIAL_ENEMIES: Record<string, Enemy> = {
  // LÍNH THƯỜNG
  minion_north: {
    id: 'minion_north',
    name: 'Bào Tử Virus Mã Độc',
    title: 'Nhiễm Tạp Âm Số Hóa Kinh Bắc',
    maxHp: 90,
    hp: 90,
    attack: 16,
    defense: 8,
    expReward: 70,
    goldReward: 60,
    spriteType: 'glitch_minion',
    attackCooldown: 2.1,
    color: '#8b0000',
    quote: 'Ta sẽ xóa sạch ký ức về tà áo Kinh Bắc!',
  },
  minion_central: {
    id: 'minion_central',
    name: 'Huyễn Thần Sông Hương',
    title: 'U Hồn Ký Ức Hoàng Triều',
    maxHp: 160,
    hp: 160,
    attack: 24,
    defense: 14,
    expReward: 120,
    goldReward: 90,
    spriteType: 'shadow_spirit',
    attackCooldown: 1.9,
    color: '#5b1f7a',
    quote: 'Hoàng thành đã phai nhạt... sao ngươi còn níu giữ?',
  },
  minion_highland: {
    id: 'minion_highland',
    name: 'Quái Thú Sương Rừng',
    title: 'Hắc Khí Rừng Già',
    maxHp: 240,
    hp: 240,
    attack: 34,
    defense: 22,
    expReward: 200,
    goldReward: 140,
    spriteType: 'forest_beast',
    attackCooldown: 1.8,
    color: '#1a4329',
    quote: 'Tiếng cồng chiêng rồi cũng sẽ chìm vào quên lãng!',
  },
  minion_south: {
    id: 'minion_south',
    name: 'Thủy Quái Phù Sa',
    title: 'Bóng Đêm Đầm Lầy',
    maxHp: 320,
    hp: 320,
    attack: 42,
    defense: 28,
    expReward: 300,
    goldReward: 200,
    spriteType: 'river_fiend',
    attackCooldown: 1.7,
    color: '#1c3144',
    quote: 'Phù sa sẽ cuốn trôi chiếc khăn rằn mộc mạc!',
  },

  // =========================================================================
  // MINI BOSS TỪNG BẢN ĐỒ (ĐỘC QUYỀN VĂN HÓA VÙNG MIỀN)
  // =========================================================================
  miniboss_north: {
    id: 'miniboss_north',
    name: '👑 Hắc Xà Thời Không (Chrono Serpent)',
    title: 'Cuồng Nộ Cổ Loa & Thăng Long',
    maxHp: 380,
    hp: 380,
    attack: 35,
    defense: 20,
    expReward: 450,
    goldReward: 350,
    dropItemId: 'riu_dong_dong_son',
    spriteType: 'miniboss_north',
    attackCooldown: 1.7,
    color: '#d97706',
    quote: 'Thành Cổ Loa ngàn năm sẽ bị chôn vùi trong biển dữ liệu hỗn mang!',
  },
  miniboss_central: {
    id: 'miniboss_central',
    name: '👑 Hỏa Diệm Trùng Cung Đình (Flame Phantom)',
    title: 'Oan Linh Lồng Đèn Cố Đô',
    maxHp: 520,
    hp: 520,
    attack: 48,
    defense: 30,
    expReward: 650,
    goldReward: 500,
    dropItemId: 'tra_sen_cung_dinh',
    spriteType: 'miniboss_central',
    attackCooldown: 1.6,
    color: '#9333ea',
    quote: 'Lầu Ngũ Phụng đã rực lửa ngàn xưa, ngươi dám ngăn ngọn lửa hận này?',
  },
  miniboss_highland: {
    id: 'miniboss_highland',
    name: '👑 Thạch Thú Hư Không (Void Golem)',
    title: 'Hộ Vệ Vách Đá Thác Dray Nur',
    maxHp: 680,
    hp: 680,
    attack: 56,
    defense: 42,
    expReward: 900,
    goldReward: 700,
    dropItemId: 'tho_cam_tay_nguyen',
    spriteType: 'miniboss_highland',
    attackCooldown: 1.5,
    color: '#0f172a',
    quote: 'Tiếng thác đổ ngàn năm sẽ nghiền nát thân xác phàm trần của ngươi!',
  },
  miniboss_south: {
    id: 'miniboss_south',
    name: '👑 Hắc Thủy Ngạc Ngư 2099 (Cyber Croc)',
    title: 'Bá Chủ Đầm Lầy Cơ Giới Hóa',
    maxHp: 850,
    hp: 850,
    attack: 65,
    defense: 48,
    expReward: 1200,
    goldReward: 900,
    dropItemId: 'thiet_con_nam_bo',
    spriteType: 'miniboss_south',
    attackCooldown: 1.4,
    color: '#065f46',
    quote: 'Dòng sông Cửu Long giờ là mạng lưới cáp quang của ta!',
  },
  miniboss_islands: {
    id: 'miniboss_islands',
    name: '👑 Hải Vương Lôi Đài Sóng Gió (Storm Titan)',
    title: 'Chúa Tể Cuồng Phong Biển Đông',
    maxHp: 1050,
    hp: 1050,
    attack: 75,
    defense: 55,
    expReward: 1600,
    goldReward: 1200,
    dropItemId: 'giap_tru_dai_viet',
    spriteType: 'miniboss_islands',
    attackCooldown: 1.3,
    color: '#0284c7',
    quote: 'Sóng dữ Biển Đông sẽ nuốt chửng ngọn hải đăng và bia đá chủ quyền!',
  },

  // =========================================================================
  // SIÊU TRÙM CUỐI: CHÚA TỂ VIRUS LÃNG QUÊN (OBLIVION CORE MASTER 2099)
  // =========================================================================
  boss_virus: {
    id: 'boss_virus',
    name: '👑 CHÚA TỂ VIRUS LÃNG QUÊN (Oblivion Master 2099)',
    title: 'Hạch Tâm Xóa Sổ Ký Ức Cội Nguồn Dân Tộc',
    maxHp: 1500,
    hp: 1500,
    attack: 90,
    defense: 65,
    expReward: 3500,
    goldReward: 2500,
    dropItemId: 'hoang_bao_long_van',
    spriteType: 'boss_virus',
    phase: 1,
    attackCooldown: 1.2,
    color: '#a00028',
    quote: '2026 là thời của thế giới ảo vô căn cội! Ta từ năm 2099 gửi virus về để xóa sổ Việt Phục mãi mãi!',
  }
};
