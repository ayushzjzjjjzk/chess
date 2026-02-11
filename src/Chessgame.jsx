import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export default function ChessGame() {
    const [game, setGame] = useState(new Chess());
    const [moveHistory, setMoveHistory] = useState([]);
    const [gameOver, setGameOver] = useState(false);

    const makeAMove = (move) => {
        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move(move);

        if (result) {
            setGame(gameCopy);
            setMoveHistory([...moveHistory, result.san]);

            if (gameCopy.isGameOver()) {
                setGameOver(true);
            }
            return true;
        }
        return false;
    };

    const onDrop = (sourceSquare, targetSquare, piece) => {
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: piece && piece.toLowerCase() === "p" && 
                      (targetSquare[1] === "8" || targetSquare[1] === "1") 
                      ? "q" 
                      : undefined,
        });

        return move;
    };

    const resetGame = () => {
        setGame(new Chess());
        setMoveHistory([]);
        setGameOver(false);
    };

    const getStatus = () => {
        const currentGame = game;

        if (gameOver) {
            if (currentGame.isCheckmate()) {
                return `Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins!`;
            }
            if (currentGame.isDraw()) {
                return "Draw!";
            }
            if (currentGame.isStalemate()) {
                return "Stalemate!";
            }
            return "Game Over";
        }

        if (currentGame.isCheck()) {
            return `${game.turn() === "w" ? "White" : "Black"} is in check!`;
        }

        return `${game.turn() === "w" ? "White" : "Black"} to move`;
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>♟️ Chess Game ♟️</h1>

            <div style={styles.wrapper}>
                <div style={styles.gameSection}>
                    <div style={styles.status}>{getStatus()}</div>

                    <div style={styles.boardWrapper}>
                        <Chessboard
                            boardOrientation="white"
                            position={game.fen()}
                            onPieceDrop={onDrop}
                            boardWidth={500}
                            arePremovesAllowed={false}
                            customBoardStyle={{
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                            }}
                            customDarkSquareStyle={{
                                backgroundColor: "#8ca055",
                            }}
                            customLightSquareStyle={{
                                backgroundColor: "#eed26e",
                            }}
                            customDropSquareStyle={{
                                backgroundColor: "rgba(255, 255, 0, 0.4)",
                            }}
                        />
                    </div>

                    <button
                        onClick={resetGame}
                        style={styles.button}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#1976d2")}
                    >
                        New Game
                    </button>

                    {moveHistory.length > 0 && (
                        <div style={styles.historyContainer}>
                            <h3 style={styles.historyTitle}>Moves:</h3>
                            <div style={styles.movesList}>
                                {moveHistory.map((move, index) => (
                                    <span key={index} style={styles.moveItem}>
                                        {Math.floor(index / 2) + 1}. {index % 2 === 0 ? move : move}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
        fontSize: "32px",
        fontWeight: "700",
        color: "#333",
        marginBottom: "30px",
        letterSpacing: "2px",
    },
    wrapper: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        maxWidth: "600px",
    },
    gameSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
        width: "100%",
    },
    status: {
        fontSize: "20px",
        fontWeight: "600",
        color: "#1976d2",
        minHeight: "28px",
        textAlign: "center",
        padding: "10px",
    },
    boardWrapper: {
        display: "flex",
        justifyContent: "center",
        borderRadius: "8px",
        overflow: "hidden",
    },
    button: {
        padding: "12px 32px",
        fontSize: "16px",
        fontWeight: "600",
        backgroundColor: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginTop: "10px",
    },
    historyContainer: {
        width: "100%",
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
    },
    historyTitle: {
        margin: "0 0 12px 0",
        fontSize: "14px",
        fontWeight: "700",
        color: "#555",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    movesList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
    },
    moveItem: {
        padding: "6px 12px",
        backgroundColor: "#e3f2fd",
        color: "#1976d2",
        borderRadius: "4px",
        fontSize: "13px",
        fontWeight: "500",
        border: "1px solid #bbdefb",
    },
};