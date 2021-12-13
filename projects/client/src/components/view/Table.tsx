import { NDataTable } from "naive-ui";
import {
  RowKey,
  TableColumn,
  TableColumns,
} from "naive-ui/lib/data-table/src/interface";
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  PropType,
  ref,
} from "vue";
import { InlineAction } from "..";
import { useRef } from "../../hooks";
import { ListService } from "../../service";
import { IViewNode } from "../../types";
import style from "./index.module.scss";

export const Table = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
  },
  setup(props) {
    const service = inject<ListService<Record<string, unknown>>>("service");
    if (!service) {
      throw new Error("service not defined");
    }
    const columns = computed(() => {
      const dataColumns = props.node.children
        .filter((c) => c.name === "column")
        .map((item) => {
          return {
            title: item.attrs.displayName as string,
            key: item.attrs.field as string,
            width: item.attrs.width ? Number(item.attrs.width) : 120,
          };
        });

      return dataColumns;
    });
    const data = useRef(service.state);
    const active = useRef(service.current);
    const loading = useRef(service.loading);
    const onPageChange = (page: number) => {
      service.setCurrentPage(page);
    };
    const onPageSizeChange = (pageSize: number) => {
      service.setPageSize(pageSize);
    };
    const onSelect = (rowKeys: RowKey[]) => {
      service.current.value = rowKeys.map(
        (key) =>
          service.state.raw.list.find(
            (r) => r[props.node.attrs.key as string] === key
          ) as Record<string, unknown>
      );
    };
    return () => {
      const _columns = [
        {
          type: "selection",
          fixed: "left",
        },
        ...columns.value,
      ] as TableColumns;
      _columns.push({
        title: "操作",
        fixed: "right",
        key: "operator",
        width: 120,
        render: (row, rowIndex) => {
          const inlineAction = props.node.children.find(
            (n) => n.name === "inline-action"
          );
          if (inlineAction) {
          }
          if (inlineAction) {
            const inlineActions = inlineAction.children.filter(
              (c) => c.name === "action"
            );
            return inlineActions.map((action, index) => {
              return (
                <InlineAction node={action} key={index} rowIndex={rowIndex} />
              );
            });
          }
          return null;
        },
      } as TableColumn);
      return (
        <div class={style.table}>
          <NDataTable
            remote
            loading={loading.value}
            rowKey={(record) =>
              record[(props.node.attrs.key as string) || "code"]
            }
            columns={_columns}
            data={data.value.list}
            pagination={{
              pageSize: data.value.pageSize,
              page: data.value.current,
              pageCount: Math.ceil(
                (data.value.total * 1.0) / data.value.pageSize
              ),
              itemCount: data.value.total,
              pageSizes: [10, 20, 50],
              showSizePicker: true,
            }}
            onUpdatePage={onPageChange}
            onUpdatePageSize={onPageSizeChange}
            onUpdateCheckedRowKeys={onSelect}
            maxHeight={280}
            checkedRowKeys={active.value.map(
              (record) => record[props.node.attrs.key as string] as string
            )}
            scrollX={_columns.reduce((last, now) => {
              return last + (now.width || 0);
            }, 0)}
          />
        </div>
      );
    };
  },
});
