// @ts-check
import {
  useGame,
  usePlayer,
  usePlayers,
  // @ts-ignore
} from "@empirica/core/player/classic/react";
import { useCallback, useEffect, useMemo, useRef } from "react";

/** @typedef {{ allowOutOfOrder: boolean }} Treatment */

/** @typedef {"message" | "no-deal" | "proposal"} MessageType */

/**
 * @typedef {{
 *   id: string;
 *   type: MessageType;
 *   text: string;
 *   originalText?: string;
 *   playerId: string;
 *   gamePhase: string;
 *   timestamp: number;
 *   noDealStatus?: "pending" | "ended" | "continued" | "unilateral";
 *   proposal?: number;
 *   proposalStatus?: "pending" | "rejected" | "accepted";
 *   agentType: "user" | "assistant";
 * }} Message
 */

export default function useGameMechanics() {
  const game = useGame();
  const player = usePlayer();
  const players = usePlayers();

  const isLllGame = players.length === 1;

  const playerId = player.id;
  const otherPlayerId = useMemo(
    () =>
      !isLllGame
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
      const currentPlayerId = game.get("currentTurnPlayerId");

      // If the game is LLL, we need to switch between the player and the assistant
      // If the game is Human vs Human, we need to switch to the other player
      // If force switch is true, we need to switch to the current player
      const nextPlayerId = switchToSelf
        ? playerId
        : isLllGame
        ? currentPlayerId === playerId
          ? otherPlayerId
          : playerId
        : otherPlayerId;

      currentPlayerId === playerId && !switchToSelf ? otherPlayerId : playerId;
      game.set("currentTurnPlayerId", nextPlayerId);
    },
    [game, playerId, otherPlayerId, isLllGame]
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

    // When the LLM player walks away from the negotiation, we need to alert the user
    const isNoDealUnilateral = game
      .get("messages")
      .some(
        (message) =>
          message.noDealStatus === "unilateral" && message.playerId !== playerId
      );

    if (isLllGame && isNoDealUnilateral) {
      window.alert("The other player has walked away from the negotiation.");
    }
  }, [game, player, playerId, isLllGame]);

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

  const hasNoDealUnilateral = useMemo(
    () => messages.some((message) => message.noDealStatus === "unilateral"),
    [messages]
  );

  const waitingOnOtherPlayer =
    game.get("currentTurnPlayerId") !== playerId &&
    (pendingActionMessage?.playerId === playerId || !allowOutOfOrder);

  const chatEnded =
    hasProposalAccepted || hasNoDealEnded || hasNoDealUnilateral;

  const stageSubmitted = player.stage.get("submit");

  const shouldAutoSubmit = !stageSubmitted && chatEnded;

  // This will submit the local player stage if the chat has ended by any of the players
  // It only does this once per chat, otherwise empirica crashes on attempt to submit the stage twice
  useEffect(() => {
    if (shouldAutoSubmit && !player.stage.get("submit")) {
      player.stage.set("submit", true);

      // The other player has ended the chat unilateraly
      if (hasNoDealUnilateral) {
        window.alert("The other player has walked away from the negotiation.");
      }
    }
  }, [shouldAutoSubmit, player, hasNoDealUnilateral]);

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
