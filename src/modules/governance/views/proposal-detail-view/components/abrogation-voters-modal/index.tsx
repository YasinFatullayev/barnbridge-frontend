import React from 'react';
import { ColumnsType } from 'antd/lib/table/interface';
import BigNumber from 'bignumber.js';

import Modal, { ModalProps } from 'components/antd/modal';
import Tabs from 'components/antd/tabs';
import Table from 'components/antd/table';
import Grid from 'components/custom/grid';
import ExternalLink from 'components/custom/externalLink';
import Identicon from 'components/custom/identicon';
import { Label, Paragraph, Small } from 'components/custom/typography';
import AbrogationVotersProvider, {
  useAbrogationVoters,
} from '../../providers/AbrogationVotersProvider';

import { APIVoteEntity } from 'modules/governance/api';
import {
  formatBigValue,
  getEtherscanAddressUrl,
  shortenAddr,
} from 'web3/utils';

import s from './styles.module.scss';

const Columns: ColumnsType<APIVoteEntity> = [
  {
    title: () => (
      <Small semiBold color="grey300">
        Address
      </Small>
    ),
    dataIndex: 'address',
    width: '35%',
    render: (address: string) => (
      <Grid flow="col" gap={8} align="center">
        <Identicon address={address} width={32} height={32} />
        <ExternalLink href={getEtherscanAddressUrl(address)}>
          <Paragraph type="p1" semiBold color="blue500">
            {shortenAddr(address)}
          </Paragraph>
        </ExternalLink>
      </Grid>
    ),
  },
  {
    title: () => (
      <Small semiBold color="grey300">
        Votes
      </Small>
    ),
    dataIndex: 'power',
    width: '38%',
    align: 'right',
    render: (power: BigNumber) => (
      <Paragraph type="p1" semiBold color="grey900" className={s.powerCell}>
        {formatBigValue(power, 0)}
      </Paragraph>
    ),
  },
  {
    title: () => (
      <Small semiBold color="grey300">
        Vote type
      </Small>
    ),
    dataIndex: 'support',
    width: '27%',
    render: (support: boolean) =>
      support ? (
        <Label type="lb2" semiBold className={s.forTag}>
          For
        </Label>
      ) : (
        <Label type="lb2" semiBold className={s.againstTag}>
          Against
        </Label>
      ),
  },
];

export type AbrogationVotersModalProps = ModalProps;

const AbrogationVotersModalInner: React.FunctionComponent<AbrogationVotersModalProps> = props => {
  const { ...modalProps } = props;

  const abrogationVotesCtx = useAbrogationVoters();

  function handleStateChange(stateFilter: string) {
    if (stateFilter === 'for') {
      abrogationVotesCtx.changeSupportFilter(true);
    } else if (stateFilter === 'against') {
      abrogationVotesCtx.changeSupportFilter(false);
    } else {
      abrogationVotesCtx.changeSupportFilter(undefined);
    }
  }

  function handlePaginationChange(page: number) {
    abrogationVotesCtx.changePage(page);
  }

  return (
    <Modal className={s.component} centered width={620} {...modalProps}>
      <Tabs
        className={s.tabs}
        defaultActiveKey="all"
        onChange={handleStateChange}>
        <Tabs.Tab key="all" tab="All Votes" />
        <Tabs.Tab key="for" tab="For" />
        <Tabs.Tab key="against" tab="Against" />
      </Tabs>
      <Table<APIVoteEntity>
        className={s.table}
        title={() => ''}
        columns={Columns}
        dataSource={abrogationVotesCtx.votes}
        rowKey="address"
        loading={abrogationVotesCtx.loading}
        locale={{
          emptyText: 'No votes',
        }}
        pagination={{
          total: abrogationVotesCtx.total,
          current: abrogationVotesCtx.page,
          pageSize: abrogationVotesCtx.pageSize,
          position: ['bottomRight'],
          showTotal: (total: number, [from, to]: [number, number]) => (
            <Paragraph type="p2" semiBold color="grey500">
              Showing {from} to {to} out of {total} votes
            </Paragraph>
          ),
          onChange: handlePaginationChange,
        }}
      />
    </Modal>
  );
};

const AbrogationVotersModal: React.FunctionComponent<AbrogationVotersModalProps> = props => (
  <AbrogationVotersProvider>
    <AbrogationVotersModalInner {...props} />
  </AbrogationVotersProvider>
);
export default AbrogationVotersModal;
