// @ts-check
import {
  useGame,
  usePlayer,
  usePlayers,
  // @ts-ignore
} from "@empirica/core/player/classic/react";
import { useCallback, useEffect, useMemo, useRef } from "react";

/** @typedef {{ allowOutOfOrder: boolean }} Treatment */

/** @typedef {"message" | "deal" | "no-deal" | "proposal"} MessageType */

/**
 * @typedef {{
 *   id: string;
 *   type: MessageType;
 *   text: string;
 *   playerId: string;
 *   gamePhase: string;
 *   timestamp: number;
 *   noDealStatus?: "pending" | "ended" | "continued";
 *   proposal?: number;
 *   proposalStatus?: "pending" | "rejected" | "accepted";
 *   agentType: "user" | "agent";
 * }} Message
 */

export default function useGameMechanics() {
  const game = useGame();
  const player = usePlayer();
  const players = usePlayers();

  const playerId = player.id;
  const otherPlayerId = useMemo(
    () =>
      players.length === 2
        ? players.find((p) => p.id !== playerId)?.id
        : `${playerId}-assistant`,
    [players]
  );

  /** @type {Treatment} */
  const { allowOutOfOrder } = /** @type {any} */ (game.get("treatment"));

  /** @type {Message[]} */
  const messages = /** @type {any} */ (game.get("messages")) || [];

  /**
   * @param {Message[]} newMessages
   * @returns {void}
   */
  const setMessages = useCallback(
    (newMessages) => game.set("messages", newMessages),
    [game]
  );

  const switchTurns = useCallback(
    (switchToSelf = false) => {
      const nextPlayerId = !switchToSelf ? otherPlayerId : playerId;
      game.set("currentTurnPlayerId", nextPlayerId);
    },
    [game, playerId, otherPlayerId]
  );

  const endWithDeal = useCallback(
    (price) => {
      // We might want to save this data to a stage or a round instead if the game can have multiple rounds
      game.set("result", "deal-reached");
      game.set("price", price);
      player.stage.set("submit", true);
    },
    [game, player]
  );

  const endWithNoDeal = useCallback(() => {
    // We might want to save this data to a stage or a round instead if the game can have multiple rounds
    game.set("result", "no-deal");
    player.stage.set("submit", true);
  }, [game, player]);

  const pendingActionMessage = useMemo(
    () =>
      messages.findLast(
        (message) =>
          message.proposalStatus === "pending" ||
          message.noDealStatus === "pending"
      ),
    [messages]
  );

  const hasProposalPending =
    pendingActionMessage?.type === "proposal" &&
    pendingActionMessage.playerId !== playerId;

  const hasNoDealPending =
    pendingActionMessage?.type === "no-deal" &&
    pendingActionMessage.playerId !== playerId;

  const hasProposalAccepted = useMemo(
    () => messages.some((message) => message.proposalStatus === "accepted"),
    [messages]
  );

  const hasNoDealEnded = useMemo(
    () => messages.some((message) => message.noDealStatus === "ended"),
    [messages]
  );

  const waitingOnOtherPlayer =
    game.get("currentTurnPlayerId") !== playerId &&
    (pendingActionMessage?.playerId === playerId || !allowOutOfOrder);

  const chatEnded = hasProposalAccepted || hasNoDealEnded;

  const stageSubmitted = player.stage.get("submit");

  const shouldAutoSubmit = !stageSubmitted && chatEnded;

  // This will submit the local player stage if the chat has ended by any of the players
  // It only does this once per chat, otherwise empirica crashes on attempt to submit the stage twice
  useEffect(() => {
    if (shouldAutoSubmit && !player.stage.get("submit")) {
      player.stage.set("submit", true);
    }
  }, [shouldAutoSubmit, player]);

  return useMemo(
    () => ({
      playerId,
      otherPlayerId,
      messages,
      setMessages,
      switchTurns,
      waitingOnOtherPlayer,
      endWithDeal,
      endWithNoDeal,
      hasProposalPending,
      hasNoDealPending,
    }),
    [
      messages,
      setMessages,
      switchTurns,
      playerId,
      otherPlayerId,
      waitingOnOtherPlayer,
      endWithDeal,
      endWithNoDeal,
      hasProposalPending,
      hasNoDealPending,
    ]
  );
}
