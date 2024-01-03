import { createStyles, makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardStyle: {
      marginTop: 15,
      maxWidth: "50%",
      margin: "auto",
    },
    iconListStyle: {
      width: "100%",
      maxWidth: 360,
      minWidth: "50%",
      height: "80px",
      minHeight: "40px",
      marginTop: "5px",
      margin: "auto",
      display: "flex",
      flexDirection: "row",
      padding: 0,
    },
    profilePic: {
      width: "200px",
      height: "200px",
    },
  })
);
