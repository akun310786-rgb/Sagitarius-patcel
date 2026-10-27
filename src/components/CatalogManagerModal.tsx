import React, { useState } from 'react';
import { ParcelPackage } from '../types/parcel';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Package,
  CheckCircle2,
  Save,
  Boxes,
  Scale,
  Sparkles,
  ArrowRight,
  PlusCircle
} from 'lucide-react';

interface CatalogManagerModalProps {
  packages: ParcelPackage[];
  onClose: () => void;
  onUpdatePackage: (updated: ParcelPackage) => void;
  onAddNewPackage: (newPkg: ParcelPackage) => void;
}

export const CatalogManagerModal: React.FC<CatalogManagerModalProps> = ({
  packages,
  onClose,
  onUpdatePackage,
  onAddNewPackage
}) => {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[0]?.id || '');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Edit buffer state
  const selectedPkg = packages.find((p) => p.id === selectedPkgId) || packages[0];

  const [name, setName] = useState(selectedPkg?.name || '');
  const [category, setCategory] = useState<'bunda' | 'anak' | 'pilihan' | 'uang' | 'satuan'>(
    selectedPkg?.category || 'bunda'
  );
  const [tag, setTag] = useState(selectedPkg?.tag || '');
  const [tier, setTier] = useState(selectedPkg?.tier || '');
  const [dailyPayment, setDailyPayment] = useState<number>(selectedPkg?.dailyPayment || 2000);
  const [thrBonus, setThrBonus] = useState(selectedPkg?.thrBonus || '');
  const [bonusGift, setBonusGift] = useState(selectedPkg?.bonusGift || '');
  const [description, setDescription] = useState(selectedPkg?.description || '');
  const [targetPrice, setTargetPrice] = useState<number>(selectedPkg?.targetPrice || 650000);
  const [weeklyPayment, setWeeklyPayment] = useState<number>(selectedPkg?.weeklyPayment || 14000);
  const [durationDays, setDurationDays] = useState<number>(selectedPkg?.durationDays || 325);
  const [weight, setWeight] = useState(selectedPkg?.weight || '± 8 kg');
  const [imageUrl, setImageUrl] = useState(selectedPkg?.imageUrl || '');
  const [items, setItems] = useState<string[]>(selectedPkg?.items || []);
  const [newItemInput, setNewItemInput] = useState<string>('');

  const [notificationMsg, setNotificationMsg] = useState<string>('');

  // Switch selected package
  const handleSelectPackage = (pkg: ParcelPackage) => {
    setIsCreatingNew(false);
    setSelectedPkgId(pkg.id);
    setName(pkg.name);
    setCategory(pkg.category);
    setTag(pkg.tag);
    setTier(pkg.tier || '');
    setDailyPayment(pkg.dailyPayment || 2000);
    setThrBonus(pkg.thrBonus || '');
    setBonusGift(pkg.bonusGift || '');
    setDescription(pkg.description);
    setTargetPrice(pkg.targetPrice);
    setWeeklyPayment(pkg.weeklyPayment);
    setDurationDays(pkg.durationDays || 325);
    setWeight(pkg.weight);
    setImageUrl(pkg.imageUrl);
    setItems([...pkg.items]);
    setNotificationMsg('');
  };

  // Switch to creating new package
  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setSelectedPkgId('');
    setName('Paket Bunda — Super');
    setCategory('bunda');
    setTag('HOT SALE');
    setTier('Super');
    setDailyPayment(4000);
    setThrBonus('THR Rp 500.000');
    setBonusGift('Container Box Plastik');
    setDescription('Paket sembako dan biskuit Idul Fitri spesial.');
    setTargetPrice(1300000);
    setWeeklyPayment(28000);
    setDurationDays(325);
    setWeight('± 10 kg');
    setImageUrl('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80');
    setItems([
      'Container Box Plastik (Bonus)',
      'THR Tunai Rp 500.000 (Bonus)',
      'Khong Guan Kaleng 1600 gr',
      'Minyak Goreng 2 Liter'
    ]);
    setNotificationMsg('');
  };

  // Add item to package
  const handleAddItem = () => {
    if (!newItemInput.trim()) return;
    setItems([...items, newItemInput.trim()]);
    setNewItemInput('');
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreatingNew) {
      const newPkg: ParcelPackage = {
        id: `pkg-${Date.now()}`,
        name: name.trim(),
        category,
        tag: tag.trim() || 'EDISI LEBARAN',
        tier,
        dailyPayment,
        durationDays,
        thrBonus,
        bonusGift,
        description: description.trim(),
        targetPrice,
        weeklyPayment,
        weight: weight.trim(),
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
        items
      };
      onAddNewPackage(newPkg);
      setSelectedPkgId(newPkg.id);
      setIsCreatingNew(false);
      setNotificationMsg('Paket baru berhasil ditambahkan ke katalog!');
    } else {
      const updated: ParcelPackage = {
        id: selectedPkgId,
        name: name.trim(),
        category,
        tag: tag.trim(),
        tier,
        dailyPayment,
        durationDays,
        thrBonus,
        bonusGift,
        description: description.trim(),
        targetPrice,
        weeklyPayment,
        weight: weight.trim(),
        imageUrl: imageUrl.trim(),
        items
      };
      onUpdatePackage(updated);
      setNotificationMsg('Perubahan paket dan isi parcel berhasil disimpan!');
    }

    setTimeout(() => {
      setNotificationMsg('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-1">
            <Boxes className="w-4 h-4" />
            <span>Manajemen Operasional & Gudang Pusat</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Pengaturan Katalog Paket & Kustomisasi Isi Parcel
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl">
            Kelola rincian katalog paket Lebaran 2027, ubah target tabungan, sesuaikan cicilan mingguan, dan kustomisasi isi toples kue atau sembako secara real-time.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {notificationMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notificationMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left list of packages */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Daftar Paket ({packages.length})
                </span>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Paket</span>
                </button>
              </div>

              <div className="space-y-2">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center space-x-3 ${
                      selectedPkgId === pkg.id && !isCreatingNew
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="text-xs flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{pkg.name}</div>
                      <div className="text-emerald-700 font-semibold font-mono text-[11px]">
                        Rp {pkg.targetPrice.toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {pkg.items.length} item · {pkg.weight}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right edit form */}
            <form onSubmit={handleSave} className="lg:col-span-8 space-y-5 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-emerald-600" />
                    <span>{isCreatingNew ? 'Buat Paket Baru' : `Edit: ${name}`}</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: {isCreatingNew ? 'Baru (Auto-Generated)' : selectedPkgId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Paket *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kategori Sesuai Flyer *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                    >
                      <option value="bunda">Paket Bunda (Reguler, Silver, Gold, Platinum)</option>
                      <option value="anak">Paket Anak (Hemat, Asyik, Ceria, Hebat)</option>
                      <option value="pilihan">Paket Pilihan (Diamond, Sultan)</option>
                      <option value="uang">Paket Uang (Munggahan & Lebaran)</option>
                      <option value="satuan">Paket Barang Satuan (50 Komoditas)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Setoran Harian Flyer (Rp/hari) *</label>
                    <input
                      type="number"
                      required
                      step="500"
                      value={dailyPayment}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        setDailyPayment(val);
                        setTargetPrice(val * 325);
                        setWeeklyPayment(val * 7);
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono text-emerald-800 font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">x 325 Hari</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bonus THR Tunai Flyer</label>
                    <input
                      type="text"
                      placeholder="Contoh: THR Rp 600.000"
                      value={thrBonus}
                      onChange={(e) => setThrBonus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-amber-700 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hadiah Langsung Flyer</label>
                    <input
                      type="text"
                      placeholder="Contoh: Container Box Plastik / Koper"
                      value={bonusGift}
                      onChange={(e) => setBonusGift(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Tabungan (Rp) *</label>
                    <input
                      type="number"
                      required
                      step="25000"
                      value={targetPrice}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10) || 0;
                        setTargetPrice(val);
                        setWeeklyPayment(Math.round(val / 45));
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cicilan / Minggu (Rp) *</label>
                    <input
                      type="number"
                      required
                      step="1000"
                      value={weeklyPayment}
                      onChange={(e) => setWeeklyPayment(parseInt(e.target.value, 10) || 0)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Estimasi Bobot Fisik *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: ± 11.5 kg"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Badge / Tag Promo</label>
                    <input
                      type="text"
                      placeholder="TERFAVORIT KELUARGA"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold text-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Foto Banner Paket (URL)</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deskripsi Paket</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Package Items Customization Manager */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-emerald-600" />
                      <span>Rincian Komponen Isi Parcel ({items.length} Macam)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Tambah atau kurangi bahan sembako, biskuit, atau toples kue kering dalam paket ini
                    </p>
                  </div>
                </div>

                {/* Add new item input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ketik nama item baru... (contoh: 1 Toples Putri Salju Keju 500 gr)"
                    value={newItemInput}
                    onChange={(e) => setNewItemInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah</span>
                  </button>
                </div>

                {/* Items list with remove buttons */}
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-800">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition"
                        title="Hapus item ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action save bar */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreatingNew ? 'Simpan & Publikasikan Paket' : 'Simpan Perubahan Paket'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
