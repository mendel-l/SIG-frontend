import { useState, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, Search, Check } from 'lucide-react';
import { cn } from '@/utils';
import { AssetType } from '@/types';

interface Asset {
  id: number;
  name: string;
  type: AssetType;
  code?: string;
  zone?: string;
}

interface AssetFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selectedTypes: AssetType[], selectedIds: number[]) => void;
  assets: Asset[];
  initialSelectedTypes?: AssetType[];
  initialSelectedIds?: number[];
}

export function AssetFilterModal({
  isOpen,
  onClose,
  onApply,
  assets,
  initialSelectedTypes = [],
  initialSelectedIds = [],
}: AssetFilterModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<AssetType[]>(initialSelectedTypes);
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>(initialSelectedIds);
  const [activeTab, setActiveTab] = useState<AssetType>('Tanque');

  const assetTypes: AssetType[] = ['Tanque', 'Tubería', 'Plomero'];

  const filteredAssets = useMemo(() => {
    let filtered = assets.filter((asset) => asset.type === activeTab);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(query) ||
          asset.code?.toLowerCase().includes(query) ||
          asset.zone?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [assets, activeTab, searchQuery]);

  const handleToggleAssetType = (type: AssetType) => {
    setSelectedAssetTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleToggleAsset = (assetId: number) => {
    setSelectedAssetIds((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const handleSelectAllInTab = () => {
    const idsInTab = filteredAssets.map((asset) => asset.id);
    setSelectedAssetIds((prev) => [...new Set([...prev, ...idsInTab])]);
  };

  const handleClearAllInTab = () => {
    const idsInTab = filteredAssets.map((asset) => asset.id);
    setSelectedAssetIds((prev) => prev.filter((id) => !idsInTab.includes(id)));
  };

  const handleApply = () => {
    onApply(selectedAssetTypes, selectedAssetIds);
    onClose();
  };

  const handleCancel = () => {
    setSelectedAssetTypes(initialSelectedTypes);
    setSelectedAssetIds(initialSelectedIds);
    onClose();
  };

  const selectedCountInTab = filteredAssets.filter((asset) =>
    selectedAssetIds.includes(asset.id)
  ).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <span>Filtrar por Activo</span>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {/* Asset Type Chips */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de Activo
            </label>
            <div className="flex flex-wrap gap-2">
              {assetTypes.map((type) => {
                const isSelected = selectedAssetTypes.includes(type);
                const count = assets.filter((a) => a.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => handleToggleAssetType(type)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {type} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabs for browsing assets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Seleccionar Activos Específicos
            </label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {assetTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={cn(
                      'flex-1 px-4 py-2.5 text-sm font-medium transition-colors',
                      activeTab === type
                        ? 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4 space-y-3">
                {/* Search */}
                <Input
                  type="text"
                  placeholder={`Buscar ${activeTab.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search />}
                />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCountInTab} de {filteredAssets.length} seleccionados
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAllInTab}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Seleccionar todo
                    </button>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button
                      onClick={handleClearAllInTab}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                {/* Asset List */}
                <div className="max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAssets.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No se encontraron activos</p>
                    </div>
                  ) : (
                    filteredAssets.map((asset) => {
                      const isSelected = selectedAssetIds.includes(asset.id);
                      return (
                        <button
                          key={asset.id}
                          onClick={() => handleToggleAsset(asset.id)}
                          className={cn(
                            'w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                            isSelected && 'bg-primary-50 dark:bg-primary-900/20'
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1 text-left">
                            <div
                              className={cn(
                                'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                                isSelected
                                  ? 'bg-primary-600 border-primary-600'
                                  : 'border-gray-300 dark:border-gray-600'
                              )}
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {asset.name}
                              </p>
                              <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                                {asset.code && <span>Código: {asset.code}</span>}
                                {asset.zone && (
                                  <>
                                    {asset.code && <span>•</span>}
                                    <span>Zona: {asset.zone}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleApply}>
          Aplicar ({selectedAssetTypes.length} tipos, {selectedAssetIds.length} activos)
        </Button>
      </ModalFooter>
    </Modal>
  );
}

