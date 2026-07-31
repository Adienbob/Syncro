import { ActivityActions } from "../constants";
import { ActivityLog, FormattedActivity } from "../model";

export function formatActivity(
   activity: ActivityLog
): FormattedActivity {
   const { actor, entity } = activity.metadata.snapshot;
   const { details } = activity.metadata;
   console.log(activity.createdAt)

   let message: string;

   switch (activity.action) {
      case ActivityActions.BOARD_CREATED:
         message = `${actor.display} created board ${entity.display}`;
         break;

      case ActivityActions.BOARD_RENAMED:
         message = `${actor.display} renamed board to ${entity.display}`;
         break;

      case ActivityActions.BOARD_DELETED:
         message = `${actor.display} deleted board ${entity.display}`;
         break;

      case ActivityActions.TASK_CREATED:
         message = `${actor.display} created task ${entity.display}`;
         break;

      case ActivityActions.TASK_UPDATED: {
         const updatedFields = Array.isArray(details.updatedFields)
            ? details.updatedFields.join(", ")
            : "";

         message = updatedFields
            ? `${actor.display} updated ${entity.display} (${updatedFields})`
            : `${actor.display} updated ${entity.display}`;
         break;
      }

      case ActivityActions.TASK_MOVED:
         message = `${actor.display} moved ${entity.display} from ${details.from} to ${details.to}`;
         break;

      case ActivityActions.TASK_DELETED:
         message = `${actor.display} deleted task ${entity.display}`;
         break;

      case ActivityActions.MEMBER_INVITED:
         message = `${actor.display} invited ${entity.display}`;
         break;

      case ActivityActions.MEMBER_ROLE_CHANGED:
         message = `${actor.display} changed ${entity.display}'s role to ${details.role}`;
         break;

      case ActivityActions.MEMBER_REMOVED:
         message = `${actor.display} removed ${entity.display}`;
         break;

      default:
         message = "Unknown activity";
   }

   return {
      id: activity.id,
      action: activity.action,
      createdAt: activity.createdAt,
      message,
   };
}