import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ChangeEvent, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Home: NextPage = () => {
  const [urlInput, setUrlInput] = useState({
    message: '',
    disable: false,
    listId: '',
  });
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [playerSrc, setPlayerSrc] = useState('');
  const [alarmDate, setAlarmDate] = useState<Date | null>();
  const [timerList, setTimerList] = useState<number[]>([]);

  useEffect(() => {
    const lastPlaylistId = localStorage.getItem('last-playlist-id');
    if (!!lastPlaylistId) {
      fetchPlaylist(lastPlaylistId);
    }
    const lastSetTime = localStorage.getItem('last-set-time');
    if (!!lastSetTime) {
      onTimeChange(lastSetTime);
    }
  }, []);

  const findNextVideo = () => {
    if (playlist.length === 0) return { title: '', videoId: '' };
    const next =
      playlist[
        playlist.findIndex(
          (v: any) =>
            v.snippet.resourceId.videoId ===
            localStorage.getItem('last-played-video-id'),
        ) + 1
      ];
    if (!next)
      return {
        title: playlist[0].snippet.title,
        videoId: playlist[0].snippet.resourceId.videoId,
      };
    return {
      title: next.snippet.title,
      videoId: next.snippet.resourceId.videoId,
    };
  };
  const onChangePlayerSrc = (videoId: string) => {
    setPlayerSrc(
      `https://www.youtube.com/embed/${videoId}?autoplay=1&fs=0&loop=1&iv_load_policy=3`,
    );
    localStorage.setItem('last-played-video-id', videoId);
    const lastSetTime = localStorage.getItem('last-set-time');
    if (!!lastSetTime) onTimeChange(lastSetTime);
  };
  const fetchPlaylist = (listId: string) => {
    fetch(`/api/playlist?playlistId=${listId}`).then((r) => {
      r.json().then(
        (json) => {
          setUrlInput({ ...urlInput, disable: false, message: '' });
          setPlaylist(json.items);
          localStorage.setItem('last-playlist-id', listId);
        },
        () => {
          setUrlInput({
            ...urlInput,
            disable: false,
            message: 'URL contains invalid list ID',
          });
          setPlaylist([]);
        },
      );
    });
  };
  const onTimeChange = (timeStr: string) => {
    localStorage.setItem('last-set-time', timeStr);
    const date = new Date();
    date.setSeconds(0, 0);
    const timeValue = timeStr.split(':').map((v) => parseInt(v, 10));
    date.setHours(timeValue[0], timeValue[1]);
    const timer = window.setInterval(() => {
      const nowDate = new Date();
      if (
        date.getHours() === nowDate.getHours() &&
        date.getMinutes() === nowDate.getMinutes() &&
        nowDate.getSeconds() === 0
      ) {
        onChangePlayerSrc(findNextVideo()?.videoId);
      }
    }, 800);
    setTimerList([...timerList, timer]);
    timerList
      .filter((v) => v !== timer)
      .forEach((v) => window.clearInterval(v));
    setAlarmDate(new Date(date.valueOf()));
  };
  const onUrlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlaylist([]);
    setPlayerSrc('');
    setUrlInput({ ...urlInput, message: '' });
    if (e.target.value.length === 0) {
      setUrlInput({ ...urlInput, message: '' });
      return;
    }
    try {
      const url = new URL(e.target.value);
      const listId = url.searchParams.get('list');
      if (!listId) {
        setUrlInput({ ...urlInput, message: 'Cannot find list ID from URL' });
      } else {
        setUrlInput({ message: 'Fetching playlist', disable: true, listId });
        fetchPlaylist(listId);
      }
    } catch (e: any) {
      if (e.name === 'TypeError') {
        setUrlInput({ ...urlInput, message: 'Invalid URL' });
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Shuffle Alarm</title>
        <meta name="description" content="Make Youtube playlist to alarm" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header />
        <div className={styles.grid}>
          <div>
            <div className={styles.card}>
              <h2>Playlist URL</h2>
              <p>
                {urlInput.message}
                <input
                  type="text"
                  placeholder="URL here"
                  onChange={onUrlInputChange}
                  style={{ width: '100%' }}
                  disabled={urlInput.disable}
                />
              </p>
            </div>
            <div className={styles.card}>
              <h2>Set Alarm</h2>
              <p>
                {!alarmDate ? 'Please set time' : 'Alarm set to '}
                {alarmDate?.toLocaleTimeString()}
                <br />
                {findNextVideo().title === '' ? null : (
                  <div>
                    <small style={{ fontSize: '0.9em' }}>
                      with {findNextVideo().title}
                    </small>
                    <br />
                  </div>
                )}
                <small style={{ fontSize: '0.7em' }}>
                  {findNextVideo().videoId === ''
                    ? null
                    : findNextVideo().videoId}
                </small>
              </p>
              <br />
              <input
                type="time"
                onChange={(e) => onTimeChange(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
            <div className={styles.card}>
              <h2>Player</h2>
              {!playerSrc ? (
                <hr />
              ) : (
                <iframe
                  width="100%"
                  height="auto"
                  src={playerSrc}
                  frameBorder="0"
                  allow={'autoplay'}
                />
              )}
            </div>
          </div>
          <div className={styles.card}>
            <h2>Playlist</h2>
            {playlist.map((v: any) => (
              <div
                key={v.snippet.resourceId.videoId}
                onClick={() => onChangePlayerSrc(v.snippet.resourceId.videoId)}
              >
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src={v.snippet.thumbnails.high.url}
                          width={81}
                          height={60}
                          loading={'lazy'}
                          alt={'thumbnail image'}
                          style={{ marginRight: '12px' }}
                        />
                      </td>
                      <td>
                        <span>{v.snippet.title} </span>
                        <br />
                        <small style={{ fontSize: '0.7em' }}>
                          {v.snippet.resourceId.videoId}
                        </small>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
