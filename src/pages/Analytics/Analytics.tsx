import {
  Box,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  TableCaption,
  useDisclosure,
} from '@chakra-ui/react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import { formatValue } from 'react-currency-input-field';
import { Items, Item, Inventory, Merch } from '../../utils/types';
import { useTranslation } from 'react-i18next';

import './Analytics.scss';

interface Props {
  inventory: Inventory;
}

const Analytics = ({ inventory: { merchIn, merchOut, items } }: Props) => {
  const { t } = useTranslation();

  const totalPenya = (merchArray: Array<Merch>): number => {
    let penya: number = 0;
    merchArray
      .filter((merchItem) => merchItem.itemName)
      .forEach((merchItem) => {
        penya += Number(merchItem.price) * Number(merchItem.amount);
      });
    return penya;
  };

  const soldAmount = (itemName?: string): number => {
    let count: number = 0;
    merchOut
      .filter((merchItem) => merchItem.itemName)
      .forEach((merchItem) => {
        if (merchItem.itemName.toUpperCase() === itemName?.toUpperCase()) count += Number(merchItem.amount);
      });
    return count;
  };
  const boughtAmount = (itemName?: string): number => {
    let count: number = 0;
    merchIn
      .filter((merchItem) => merchItem.itemName)
      .forEach((merchItem) => {
        if (merchItem.itemName.toUpperCase() === itemName?.toUpperCase()) count += Number(merchItem.amount);
      });
    return count;
  };
  const amountSpent = (itemName?: string): number => {
    let penya: number = 0;
    merchIn
      .filter((merchItem) => merchItem.itemName)
      .forEach((merchItem) => {
        if (merchItem.itemName.toUpperCase() === itemName?.toUpperCase())
          penya += Number(merchItem.amount) * Number(merchItem.price);
      });
    return penya;
  };
  const amountSold = (itemName?: string): number => {
    let penya: number = 0;
    merchOut
      .filter((merchItem) => merchItem.itemName)
      .forEach((merchItem) => {
        if (merchItem.itemName.toUpperCase() === itemName?.toUpperCase())
          penya += Number(merchItem.amount) * Number(merchItem.price);
      });
    return penya;
  };
  const expectedTotalSales = (itemName?: string): number => {
    return (
      boughtAmount(itemName) *
      (items.filter((item) => item.name?.toUpperCase() === itemName?.toUpperCase())[0].goalPrice || 0)
    );
  };

  const expectedEarnings = (itemName?: string): number => {
    return expectedTotalSales(itemName) - amountSpent(itemName);
  };

  const expectedTotalEarnings = (): number => {
    let penya: number = 0;
    items.forEach((item) => {
      penya += Number(expectedEarnings(item.name));
    });
    return penya;
  };

  const soldOverBoughtRatio = (itemName?: string): number =>
    Math.ceil((soldAmount(itemName) * 100) / boughtAmount(itemName));
  const saleOverSpentRatio = (itemName?: string): number =>
    Math.ceil((amountSpent(itemName) * 100) / amountSold(itemName));

  const ratioClassification = (ratio: number): string => {
    if (ratio >= 100) return 'full';
    if (ratio >= 80) return 'almost-full';
    if (ratio >= 50) return 'half';
    if (ratio >= 20) return 'low';
    return 'very-low';
  };

  return (
    <Box className="analytics-container">
      <Box className="summary earnings">
        <Stat>
          <StatLabel>{t('general.earnings')}</StatLabel>
          <StatNumber>
            <StatArrow type="increase" />{' '}
            {formatValue({
              value: (totalPenya(merchOut) - totalPenya(merchIn)).toString(),
              prefix: '$',
            })}
          </StatNumber>
        </Stat>
        <p className="expected-total-earnings">
          {t('general.expectedTotalEarnings')}:{' '}
          <b className="gold">
            {formatValue({
              value: expectedTotalEarnings().toString(),
              prefix: '$',
            })}
          </b>
        </p>
      </Box>
      <Box className="summary sales">
        <Stat>
          <StatLabel>
            <StatArrow type="increase" />
            {t('general.sales')}
          </StatLabel>
          <StatNumber>
            {formatValue({
              value: totalPenya(merchOut).toString(),
              prefix: '$',
            })}
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel>
            <StatArrow type="decrease" />
            {t('general.spent')}
          </StatLabel>
          <StatNumber>
            {formatValue({
              value: totalPenya(merchIn).toString(),
              prefix: '$',
            })}
          </StatNumber>
        </Stat>
      </Box>

      <Box className="inventory" mt={6}>
        <h2>{t('general.inventory')}</h2>
        <TableContainer className="table">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>{t('fields.title.itemName')}</Th>
                <Th>{t('fields.title.description')}</Th>
                <Th>{t('fields.title.goalPrice')}</Th>
                <Th>{t('fields.title.soldOverBought')}</Th>
                <Th>{t('fields.title.available')}</Th>
                <Th>{t('fields.title.saleOverSpent')}</Th>
                <Th>{t('fields.title.earnings')}</Th>
                <Th>{t('fields.title.expectedEarnings')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!!items.length &&
                items
                  .filter((item) => item.name)
                  .map((item, idx) => (
                    <Tr key={idx}>
                      <Td>{item.name}</Td>
                      <Td>{item.description}</Td>
                      <Td>{formatValue({ value: item.goalPrice?.toString(), prefix: '$' })}</Td>
                      <Td
                        className={`align-center availability-ratio ratio ${ratioClassification(
                          soldOverBoughtRatio(item.name),
                        )}`}
                      >
                        {soldAmount(item.name)} / {boughtAmount(item.name)} ({soldOverBoughtRatio(item.name)}%)
                      </Td>
                      <Td>{boughtAmount(item.name) - soldAmount(item.name)}</Td>
                      <Td
                        className={`align-center earnings-ratio ratio ${ratioClassification(
                          saleOverSpentRatio(item.name),
                        )}`}
                      >
                        {formatValue({ value: amountSold(item.name).toString(), prefix: '$' })} /{' '}
                        {formatValue({ value: amountSpent(item.name).toString(), prefix: '$' })} (
                        {saleOverSpentRatio(item.name)}%)
                      </Td>
                      <Td className={`${amountSold(item.name) - amountSpent(item.name) > 0 ? 'good' : 'bad'}`}>
                        {formatValue({
                          value: (amountSold(item.name) - amountSpent(item.name)).toString(),
                          prefix: '$',
                        })}{' '}
                        {amountSold(item.name) - amountSpent(item.name) - expectedEarnings(item.name) >= 0 && '🎉'}
                      </Td>
                      <Td
                        className={`${
                          amountSold(item.name) - amountSpent(item.name) - expectedEarnings(item.name) >= 0
                            ? 'good'
                            : ''
                        }`}
                      >
                        {formatValue({
                          value: expectedEarnings(item.name).toString(),
                          prefix: '$',
                        })}
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
