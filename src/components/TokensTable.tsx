import React from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Token } from "./Main";
import { TokenRow } from "./TokenRow";
import { AddToken } from "./AddToken";

type Order = "asc" | "desc";
interface TokenSort {
  name: string;
  category: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const TokensTable = (props: {
  tokens: Token[];
  tokensAreUpdated: boolean;
}) => {
  const { tokens, tokensAreUpdated } = props;

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof TokenSort>("category");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof TokenSort
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tokens.length) : 0;

  return (
    <Box mx={{ md: "10%" }}>
      {!tokensAreUpdated ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : null}
      <AddToken tokens={tokens} tokensAreUpdated={tokensAreUpdated} />
      <Box component={Paper}>
        <TableContainer>
          <Table aria-label="tokens table" size="small">
            <TableBody>
              {/* {tokens.map((token, tokenIndex) => (
                  <TokenRow
                  key={tokenIndex}
                  tokenIndex={tokenIndex}
                  tokens={tokens}
                  tokensAreUpdated={tokensAreUpdated}
                />
              ))} */}
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                tokens.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(tokens, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((token, tokenIndex) => (
                  <TokenRow
                    key={tokenIndex}
                    tokenIndex={tokenIndex}
                    tokens={tokens}
                    tokensAreUpdated={tokensAreUpdated}
                  />
                ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={tokens.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};
