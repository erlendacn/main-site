import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Validator from "validator";
import { setShares } from "../../../store/donation/actions";
import { State } from "../../../store/state";
import { TextInput } from "../../shared/Input/TextInput";
import { ShareContainer, ShareInputContainer } from "./ShareSelection.style";

export const SharesSelection: React.FC = () => {
  const dispatch = useDispatch();
  const organizations = useSelector((state: State) => state.layout.organizations);
  const shareState = useSelector((state: State) => state.donation.shares);

  if (!organizations) return <div>Ingen organisasjoner</div>;

  return (
    <ShareContainer>
      {shareState.map((share) => (
        <ShareInputContainer key={share.id}>
          <label htmlFor={share.id.toString()}>
            {organizations.filter((org) => org.id === share.id)[0].name}
          </label>
          <input
            data-cy={`org-${share.id}`}
            name={share.id.toString()}
            placeholder="0"
            value={share.split.toString()}
            onChange={(e) => {
              const newShareState = [...shareState];
              const index = newShareState
                .map((s) => {
                  return s.id;
                })
                .indexOf(share.id);
              newShareState[index].split = Validator.isInt(e.target.value)
                ? parseInt(e.target.value)
                : 0;
              dispatch(setShares(newShareState));
            }}
          />
        </ShareInputContainer>
      ))}
    </ShareContainer>
  );
};

/**
 *               tooltipText={
                organizations.filter((org) => org.id === share.id)[0].shortDesc
              }
 */
