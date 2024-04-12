import {
  Card,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from "@material-ui/core";
import TwitterIcon from "@material-ui/icons/Twitter";
import { useStyles } from "./styles";

export interface ProfileDetailsCardProps {
  fullText: string;
  tweetId: string;
  fullUrl: string;
}

export function TweetCard(props: ProfileDetailsCardProps) {
  const classes = useStyles();
  return (
    <Card className={classes.cardStyle}>
      <Grid container>
        {/* <Grid item xs={4}></Grid> */}
        <Grid item xs={12}>
          <Card
            style={{ border: "none", boxShadow: "none", overflow: "scroll" }}
          >
            <Typography variant="body1">{props.fullText}</Typography>
            <Link>{props.tweetId}</Link>
            <Card
              style={{ border: "none", boxShadow: "none", overflow: "visible" }}
            >
              <List className={classes.iconListStyle}>
                <ListItem>
                  <Link href={props.fullUrl}>
                    <ListItemIcon>
                      <TwitterIcon />
                    </ListItemIcon>
                  </Link>
                </ListItem>
              </List>
            </Card>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
}
