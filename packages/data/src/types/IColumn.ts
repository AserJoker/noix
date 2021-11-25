export interface IColumn {
  name: string;
  unique?: boolean;
  type: string;
  auto_increase?: boolean;
  _increase_counter?: number;
}
