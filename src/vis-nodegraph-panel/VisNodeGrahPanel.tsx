/* eslint-disable array-callback-return */
import React from 'react';
import { PanelProps } from '@grafana/data';
import Graph from 'react-graph-vis';
import _ from 'lodash';
import { VisNodeGrahOptions } from './types';

type Props = PanelProps<VisNodeGrahOptions>;

const nIds: string[] = [];
const eIds: string[] = [];
const titles: string[] = [];
const froms: string[] = [];
const tos: string[] = [];
const nStats: string[] = [];
const eStats: string[] = [];

export const VisNodeGrahPanel: React.FC<Props> = (props) => {
  const {
    options: { hierarchical, edgesColor, nodesColor },
    data: {
      series: [nodes, edges],
    },
    height,
    width,
  } = props;
  _.map(_.get(nodes, 'fields'), ({ name, values }) => {
    _.forIn(values, (fieldValue) => {
      fieldValue
        .toString()
        .split(',')
        .filter((_) => _ !== '')
        .map((value) => {
          if (name === 'id') {
            nIds.push(value);
          }
          if (name === 'title') {
            titles.push(value);
          }
          if (name === 'mainStat') {
            nStats.push(value);
          }
        });
    });
  });
  _.map(_.get(edges, 'fields'), ({ name, values }) => {
    _.forIn(values, (fieldValue) => {
      fieldValue
        .toString()
        .split(',')
        .filter((_) => _ !== '')
        .map((value) => {
          if (name === 'id') {
            eIds.push(value);
          }
          if (name === 'source') {
            froms.push(value);
          }
          if (name === 'target') {
            tos.push(value);
          }
          if (name === 'mainStat') {
            eStats.push(value);
          }
        });
    });
  });
  return (
    <Graph
      {...{
        graph: {
          nodes: _.uniqBy(
            _.map(nIds, (id, index) => ({ id, label: nStats[index], title: titles[index] })),
            'id'
          ),
          edges: _.uniqBy(
            _.map(eIds, (id, index) => ({ id, label: eStats[index], to: tos[index], from: froms[index] })),
            'id'
          ),
        },
        options: {
          layout: {
            hierarchical,
          },
          nodes: {
            color: nodesColor ?? '#eee',
          },
          edges: {
            color: edgesColor ?? '#fff',
          },
          height: `${height}px`,
          width: `${width}px`,
        },
        events: {
          select: (selected: { nodes: any; edges: any }) => {
            const { nodes, edges } = selected;
            console.log('Selected nodes: ', nodes, '\nSelected edges: ', edges);
          },
        },
        getNetwork: (network: any) => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
          console.log('network: ', network);
        },
      }}
    />
  );
};
