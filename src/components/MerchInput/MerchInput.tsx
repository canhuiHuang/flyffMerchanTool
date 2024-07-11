import { Box, Checkbox, Collapse, Editable, EditableInput, EditablePreview, Input, Stack } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { formatValue } from 'react-currency-input-field';
import { useTranslation } from 'react-i18next';
import { InventoryItem, Item, Merch } from '../../utils/types';

import './MerchInput.scss';

interface MerchInputProps {
  type: 'in' | 'out';
  merch: Array<Merch>;
  items?: Array<InventoryItem>;
  updateMerch: Function;
  addMerch: Function;
  deleteMerch: Function;
}

const MerchInput = ({ type, merch, items, updateMerch, addMerch, deleteMerch }: MerchInputProps) => {
  const { t } = useTranslation();

  const [selected, setSelected] = useState<Array<string>>([]);
  const onSelectHandle = (newVal: boolean, itemId: string) => {
    if (newVal) {
      if (!selected.includes(itemId)) setSelected([...selected, itemId]);
    } else {
      setSelected(selected.filter((selectedId) => selectedId !== itemId));
    }
  };

  const onDeleteHandler = () => {
    // Add confirmation modal later
    deleteMerch(selected);
    setSelected([]);
  };

  const inventoryDifference = (merchItem: Merch): number => {
    // Get amount available in inventory
    const item = items?.find((item) => item.name?.toUpperCase() === merchItem.itemName?.toUpperCase());
    if (item) return merchItem.amount - (item.purchased - item.sold);
    return -1 * merchItem.amount;
  };

  const expectedSales = (merchItem: Merch): number => {
    return merchItem.amount * (items?.filter((item) => item.name === merchItem.itemName)[0]?.goalPrice || 0);
  };

  return (
    <Box className="merch-input-container">
      <Collapse in={!!selected.length} animateOpacity>
        <Box className="actions" mb="1rem">
          <p>{t('general.selectedItems', { amount: selected.length })}</p>
          <Stack>
            <Button colorScheme="red" variant="outline" w="120px" size="sm" onClick={onDeleteHandler}>
              🗑️ {t('general.delete')}
            </Button>
          </Stack>
        </Box>
      </Collapse>
      <Box className="header-space">
        <h2>{type === 'in' ? t('general.merchIn') : t('general.merchOut')}</h2>

        <Button colorScheme="blue" size="sm" variant="outline" mb="2" onClick={() => addMerch()}>
          {t('general.addMerch')}
        </Button>
      </Box>
      <TableContainer className="merch-table table">
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th className="description">{t('fields.title.description')}</Th>
              <Th className="name">{t('fields.title.itemName')}</Th>
              <Th className="price">{t('fields.title.price')}</Th>
              <Th className="amount">{t('fields.title.amount')}</Th>
              <Th className="date">{t('fields.title.date')}</Th>
              {type === 'in' && <Th className="total-spent">{t('general.totalSpent')}</Th>}
              {type === 'out' && <Th className="sales-over-expected">{t('general.saleOverExpectedSales')}</Th>}
              <Th className="selection">{/* t('general.selection') */}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {merch.map((item: Merch, idx: number) => (
              <Tr key={item.id || idx} className={`${item.id ? 'has-id' : 'no-id'} highlightable`}>
                <Td className="description">
                  <Editable defaultValue={item.description || undefined}>
                    <EditablePreview />
                    <EditableInput
                      value={item.description}
                      onBlur={(e) => updateMerch(idx, e.target.value, 'description')}
                    />
                  </Editable>
                </Td>

                {/* Name */}
                <Td className="name">
                  <Editable defaultValue={item.itemName || undefined}>
                    <EditablePreview />
                    <EditableInput value={item.itemName} onBlur={(e) => updateMerch(idx, e.target.value, 'itemName')} />
                  </Editable>
                </Td>

                {/* Price */}
                <Td className="price">
                  <Editable>
                    <CurrencyInput
                      name="price"
                      placeholder=""
                      prefix="$"
                      defaultValue={item.price}
                      decimalsLimit={0}
                      onValueChange={(value, name, values) => updateMerch(idx, value, name)}
                    />
                    <Input as={EditableInput} />
                  </Editable>
                </Td>

                {/* Amount */}
                <Td className="amount">
                  <Editable defaultValue={item.amount || undefined}>
                    <EditablePreview />
                    <EditableInput
                      max="9999"
                      type="number"
                      value={item.amount}
                      onBlur={(e) => updateMerch(idx, e.target.value, 'amount')}
                    />
                  </Editable>
                </Td>

                {/* Date */}
                <Td className="date">
                  <Editable defaultValue={item.date || undefined}>
                    <EditablePreview />
                    <EditableInput
                      type="date"
                      value={item.date}
                      onBlur={(e) => updateMerch(idx, e.target.value, 'date')}
                    />
                  </Editable>
                </Td>

                {/* Total Spent */}
                {type === 'in' && (
                  <Td className="total-spent">
                    {formatValue({
                      value: (item.price * item.amount || 0).toString(),
                      prefix: '$',
                    })}
                  </Td>
                )}

                {/* Real Sales / Expected Sales */}
                {type === 'out' && (
                  <Td className="sales-over-expected">
                    {formatValue({
                      value: (item.price * item.amount).toString(),
                      prefix: '$',
                    })}{' '}
                    /{' '}
                    {formatValue({
                      value: expectedSales(item).toString(),
                      prefix: '$',
                    })}
                  </Td>
                )}

                {/* Selection */}
                <Td className="selection">
                  <Checkbox
                    onChange={(e) => onSelectHandle(e.target.checked, item.id)}
                    colorScheme="red"
                    isChecked={selected.includes(item.id)}
                  ></Checkbox>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MerchInput;
