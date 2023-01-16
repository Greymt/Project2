
export const META_ROBOT_NO_INDEX_NO_FOLLOW = 0;
export const META_ROBOT_INDEX_FOLLOW = 1;
export const META_ROBOT_NO_INDEX_FOLLOW = 2;

export function getAppConfig() {
  return {
    siteAddress: process.env.NEXT_PUBLIC_SITE_ADDRESS
  }
}

export const mapMetaRobot = {
  [META_ROBOT_NO_INDEX_FOLLOW]: "noindex, follow",
  [META_ROBOT_INDEX_FOLLOW]: "index, follow",
  [META_ROBOT_NO_INDEX_NO_FOLLOW]: "noindex, nofollow"
}