import { AuthErrorCode } from '@common/constants/error-code/auth-error-code.constant';
import { CommonError } from '@common/constants/error-code/error-code.constant';
import { GroupErrorCode } from '@common/constants/error-code/group-error-code.constant';
import { PermissionErrorCode } from '@common/constants/error-code/permission-error-code.constant';
import { QuizErrorCode } from '@common/constants/error-code/quiz-error-code.constant';
import { QuizzflyErrorCode } from '@common/constants/error-code/quizzfly-error-code.constant';
import { ResourceLimitErrorCode } from '@common/constants/error-code/resource-limit-error-code.constant';
import { RoleErrorCode } from '@common/constants/error-code/role-error-code.constant';
import { RoomErrorCode } from '@common/constants/error-code/room-error-code.constant';
import { SlideErrorCode } from '@common/constants/error-code/slide-error-code.constant';
import { SubscriptionErrorCode } from '@common/constants/error-code/subscription-error-code.constant';
import { UserErrorCode } from '@common/constants/error-code/user-error-code.constant';

export const ErrorCodeDetails = Object.freeze({
  ...CommonError,
  ...UserErrorCode,
  ...AuthErrorCode,
  ...RoleErrorCode,
  ...PermissionErrorCode,
  ...SlideErrorCode,
  ...QuizErrorCode,
  ...QuizzflyErrorCode,
  ...GroupErrorCode,
  ...RoomErrorCode,
  ...ResourceLimitErrorCode,
  ...SubscriptionErrorCode,
});
