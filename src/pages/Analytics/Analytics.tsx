import {
  Box,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  TableCaption,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { formatValue } from 'react-currency-input-field';
import { Items, Item, Inventory, Merch, InventoryItem } from '../../utils/types';
import { useTranslation } from 'react-i18next';

import './Analytics.scss';

interface Props {
  inventory: Inventory;
  inventoryItems: Array<InventoryItem>;
}

const Analytics = ({ inventory: { merchIn, merchOut }, inventoryItems }: Props) => {
  const { t } = useTranslation();

  const totalSales = (): number => {
    let penya: number = 0;
    inventoryItems.forEach((item) => {
      penya += Number(item.sales);
    });
    return penya;
  };

  const totalSpent = (): number => {
    let penya: number = 0;
    inventoryItems.forEach((item) => {
      penya += Number(item.spent);
    });
    return penya;
  };

  const expectedTotalSales = (): number => {
    let penya: number = 0;
    inventoryItems.forEach((item) => {
      penya += Number(item.goalPrice) * (Number(item.purchased) + Number(item.freeMerchAmount));
    });
    return penya;
  };

  const calculatedTotalProfitFromFreeMerch = (): number => {
    let penya: number = 0;
    inventoryItems.forEach((item) => {
      penya += calculatedProfitFromFreeMerch(item);
    });
    return penya;
  };

  const calculatedProfitFromFreeMerch = (item: InventoryItem): number => {
    // Free Merch profit is calculated based on the basis that purchased merch are sold before free merch

    // Case 1: No purchased Merch at all
    // Since no merch has ever been purchased for this item, its profit is just the sum of all merch outs prices of this item
    if (Number(item.purchased) === 0) return item.sales;

    // Case 2: Availability is greater than the amount of free merch available
    // Since it's purchased merch sold first basis, then this means that no free merch has been sold yet
    if (Number(item.freeMerchAmount) <= computed.availability(item)) return 0;

    // Case 3: freeAmount > availability: at least one free merch has been already sold
    // So profit from free merch is the sum of the last (freeMerchAmount) merchOut sales
    if (Number(item.freeMerchAmount) > computed.availability(item)) {
      const sortedByDateMerchOut = [...merchOut]
        .filter((merchItem: Merch) => merchItem.itemName?.toUpperCase() === item.name?.toUpperCase())
        .sort((a: Merch, b: Merch) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
      let sale: number = 0;
      let freeMerchSold: number = Number(item.freeMerchAmount) - Math.abs(computed.availability(item));

      if (freeMerchSold > 0) {
        for (let i = 0; i < sortedByDateMerchOut.length; i++) {
          const merchItem = sortedByDateMerchOut[i];

          if (Number(merchItem.amount) <= freeMerchSold) {
            sale += Number(merchItem.price) * Number(merchItem.amount);
            freeMerchSold -= Number(merchItem.amount);
          } else {
            sale += Number(merchItem.price) * Number(freeMerchSold);
            freeMerchSold = 0;
          }

          if (freeMerchSold === 0) break;
        }

        return sale; // Since sale is from free merch, sale = profit
      }
    }

    return 0;
  };

  const ratioClassification = (ratio: string): string => {
    const ratioNumber = Number(ratio.replace('%', ''));
    if (ratioNumber >= 100 || ratio === '∞') return 'very-high';
    if (ratioNumber >= 80) return 'high';
    if (ratioNumber >= 50) return 'half';
    if (ratioNumber >= 20) return 'low';
    return 'very-low';
  };

  const getRatio = (ratio: number): string => {
    if (ratio === Infinity) return '∞';
    return `${Math.ceil(ratio * 100) || 0}%`;
  };

  const computed = {
    expectedSales: (item: InventoryItem) => (item.purchased + item.freeMerchAmount) * (item.goalPrice || 0),
    expectedProfit: (item: InventoryItem) => computed.expectedSales(item) - item.spent,
    expectedTotalProfit: (): number => expectedTotalSales() - totalSpent(),
    availability: (item: InventoryItem): number => item.freeMerchAmount + item.purchased - item.sold,
    totalProfit: (): number => totalSales() - totalSpent(),
  };

  return (
    <Box className="analytics-container">
      <Box className="profit-row">
        {/* profit */}
        <Box className="summary profit">
          <Stat>
            <StatLabel>{t('general.profit')}</StatLabel>
            <StatNumber className={`${computed.totalProfit() >= 0 ? 'positive' : 'negative'}`}>
              <StatArrow type={computed.totalProfit() >= 0 ? 'increase' : 'decrease'} />{' '}
              {formatValue({
                value: computed.totalProfit().toString(),
                prefix: '$',
              })}
            </StatNumber>
          </Stat>

          <Tooltip hasArrow label={t('components.analytics.freeMerchProfitCalculations')}>
            <p className="estimated-profit-from-free-merch">
              {t('components.analytics.calculatedProfitFromFreeMerch')}:{' '}
              <b className="positive">
                {formatValue({
                  value: calculatedTotalProfitFromFreeMerch().toString(),
                  prefix: '$',
                })}
              </b>
            </p>
          </Tooltip>

          <p className="expected-total-profit">
            {t('components.analytics.expectedTotalProfit')}:{' '}
            <b className="gold">
              {formatValue({
                value: computed.expectedTotalProfit().toString(),
                prefix: '$',
              })}
            </b>
          </p>
        </Box>
      </Box>

      <Box className="summary sales">
        <Box>
          <Stat>
            <StatLabel>
              <StatArrow type="increase" />
              {t('general.sales')}
            </StatLabel>
            <StatNumber>
              {formatValue({
                value: totalSales().toString(),
                prefix: '$',
              })}
            </StatNumber>
          </Stat>
        </Box>

        <Stat>
          <StatLabel>
            <StatArrow type="decrease" />
            {t('general.spent')}
          </StatLabel>
          <StatNumber>
            {formatValue({
              value: totalSpent().toString(),
              prefix: '$',
            })}
          </StatNumber>
        </Stat>
      </Box>

      {/* Expected Sales */}
      <Box className="expected-sales">
        <p className="expected-total-sales">
          {t('general.expectedSales')}:{' '}
          <b className="gold">
            {formatValue({
              value: expectedTotalSales().toString(),
              prefix: '$',
            })}
          </b>
        </p>
      </Box>

      <Box className="inventory" mt={6}>
        <h2>{t('general.inventory')}</h2>
        <TableContainer className="table">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th className="name">{t('fields.title.itemName')}</Th>
                {/* <Th className="description">{t('fields.title.description')}</Th> */}
                <Th className="goal-price">{t('fields.title.goalPrice')}</Th>
                <Th className="free">{t('components.analytics.free')}</Th>
                <Th className="purchased">{t('components.analytics.purchased')}</Th>
                <Th className="available">{t('fields.title.available')}</Th>
                <Th className="sold">{t('components.analytics.sold')}</Th>
                <Th className="sales-over-spent">{t('fields.title.saleOverSpent')}</Th>
                <Th className="expected-sales">{t('fields.title.expectedSales')}</Th>
                <Th className="expected-profit">{t('fields.title.expectedProfit')}</Th>
                <Th className="profit">{t('fields.title.profit')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!!inventoryItems.length &&
                inventoryItems.map((item, idx) => (
                  <Tr key={idx} className="highlightable">
                    {/* Name */}
                    <Td className="name">{item.name}</Td>

                    {/* Description */}
                    {/* <Td className="description">{item.description}</Td> */}

                    {/* Goal Price */}
                    <Td className="goal-price">{formatValue({ value: item.goalPrice?.toString(), prefix: '$' })}</Td>

                    {/* Free */}
                    <Td className="free">{item.freeMerchAmount}</Td>

                    {/* Purchased */}
                    <Td className="purchased">{item.purchased}</Td>

                    {/* Available */}
                    <Td className={`available ${computed.availability(item) < 0 ? 'error' : ''}`}>
                      {computed.availability(item) >= 0 && <span>{computed.availability(item)}</span>}

                      {computed.availability(item) < 0 && (
                        <Tooltip
                          hasArrow
                          label={t('components.analytics.unexpectedAvailabilityMessage', { name: item.name })}
                        >
                          <span>{computed.availability(item)}</span>
                        </Tooltip>
                      )}
                    </Td>

                    {/* Sold */}
                    <Td
                      className={`sold align-center availability-ratio ratio ${ratioClassification(
                        getRatio(item.sold / (item.purchased + item.freeMerchAmount)),
                      )}`}
                    >
                      {item.sold} ({getRatio(item.sold / (item.purchased + item.freeMerchAmount))})
                    </Td>

                    {/* Sales / Spent */}
                    <Td
                      className={`sales-over-spent align-center profit-ratio ratio ${ratioClassification(
                        getRatio(item.sales / item.spent),
                      )}`}
                    >
                      {formatValue({ value: item.sales.toString(), prefix: '$' })} /{' '}
                      {formatValue({ value: item.spent.toString(), prefix: '$' })} ({getRatio(item.sales / item.spent)})
                    </Td>

                    {/* Expected Sales */}
                    <Td className={`expected-sales ${computed.expectedSales(item) <= 0 ? 'error' : ''}`}>
                      {computed.expectedSales(item) > 0 && (
                        <span>
                          {formatValue({
                            value: computed.expectedSales(item).toString(),
                            prefix: '$',
                          })}
                        </span>
                      )}

                      {computed.expectedSales(item) <= 0 && (
                        <Tooltip hasArrow label={t('components.analytics.unexpectedSalesMessage', { name: item.name })}>
                          {formatValue({
                            value: computed.expectedSales(item).toString(),
                            prefix: '$',
                          })}
                        </Tooltip>
                      )}
                    </Td>

                    {/* Expected Profit */}
                    <Td className={`expected-profit ${computed.expectedProfit(item) < 0 ? 'error' : ''}`}>
                      {computed.expectedProfit(item) > 0 && (
                        <span>
                          {formatValue({
                            value: computed.expectedProfit(item).toString(),
                            prefix: '$',
                          })}
                        </span>
                      )}

                      {computed.expectedProfit(item) <= 0 && (
                        <Tooltip
                          hasArrow
                          label={t('components.analytics.unexpectedProfitMessage', { name: item.name })}
                        >
                          {formatValue({
                            value: computed.expectedProfit(item).toString(),
                            prefix: '$',
                          })}
                        </Tooltip>
                      )}
                    </Td>

                    {/* Profit */}
                    <Td className={`profit ${item.sales - item.spent > 0 ? 'good' : 'bad'}`}>
                      {formatValue({
                        value: (item.sales - item.spent).toString(),
                        prefix: '$',
                      })}{' '}
                      {item.sales - item.spent > 0 && item.sales - item.spent >= computed.expectedProfit(item) && '🎉'}
                      {/* {item.sales - item.spent > 0 && item.sales - item.spent >= computed.expectedProfit(item) && (
                        <Tooltip hasArrow label={t('components.analytics.surpassedExpectedProfit')}>🎉</Tooltip>
                      )} */}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Analytics;
