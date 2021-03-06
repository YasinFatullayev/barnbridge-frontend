import React from 'react';

import Card from 'components/antd/card';
import Progress from 'components/antd/progress';
import Grid from 'components/custom/grid';
import { Paragraph } from 'components/custom/typography';
import { useProposal } from '../../providers/ProposalProvider';

const ProposalApprovalCard: React.FunctionComponent = () => {
  const proposalCtx = useProposal();

  const passed = (proposalCtx.forRate ?? 0) >= (proposalCtx.proposal?.acceptanceThreshold ?? 0);

  return (
    <Card
      title={
        <Paragraph type="p1" semiBold color="grey900"
                   hint="Approval is the percentage of votes on a proposal that the total support must be greater than for the proposal to be approved. For example, if “Approval” is set to 51%, then more than 51% of the votes on a proposal must vote “Yes” for the proposal to pass.">
          Approval
        </Paragraph>
      }>
      <Grid flow="row" gap={16}>
        <Grid flow="col" gap={8}>
          <Paragraph type="p1" semiBold color="grey900">
            {proposalCtx.forRate?.toFixed(2)}%
          </Paragraph>
          <Paragraph type="p1" color="grey500">
            (&gt; {proposalCtx.proposal?.acceptanceThreshold}% required)
          </Paragraph>
        </Grid>
        <Progress
          percent={proposalCtx.forRate}
          acceptance={proposalCtx.proposal?.acceptanceThreshold}
          strokeColor={passed ? 'var(--text-color-green500)' : 'var(--text-color-red500)'}
          trailColor={passed ? 'rgba(var(--text-color-green500-rgb), .16)' : 'rgba(var(--text-color-red500-rgb), .16)'}
        />
      </Grid>
    </Card>
  );
};

export default ProposalApprovalCard;
