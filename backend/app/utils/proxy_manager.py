
import requests
import random
import logging
import time

logger = logging.getLogger(__name__)

def get_free_proxies():
    """
    Fetches a list of free HTTPS proxies from multiple sources.
    """
    proxies = set()
    
    # Source 1: Proxyscrape (HTTP)
    try:
        url = "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=2000&country=all&ssl=all&anonymity=elite"
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            for p in r.text.strip().split('\r\n'):
                if p: proxies.add(f"http://{p}")
    except: pass

    # Source 2: Geonode (JSON) - often higher quality
    try:
        url = "https://proxylist.geonode.com/api/proxy-list?limit=50&page=1&sort_by=lastChecked&sort_type=desc&protocols=http%2Chttps&anonymityLevel=elite&speed=fast"
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            data = r.json()
            for item in data.get('data', []):
                p = f"http://{item['ip']}:{item['port']}"
                proxies.add(p)
    except: pass

    # Source 3: PubProxy
    try:
        url = "http://pubproxy.com/api/proxy?limit=5&format=txt&type=http&level=elite"
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            for p in r.text.strip().split('\r\n'):
                if p: proxies.add(f"http://{p}")
    except: pass

    return list(proxies)

def get_working_proxy():
    """
    Finds a working proxy by testing against YouTube.
    Tries up to 40 proxies to ensure success.
    """
    raw_proxies = get_free_proxies()
    if not raw_proxies:
        logger.error("No proxies found from scrapers.")
        return None
        
    random.shuffle(raw_proxies)
    logger.info(f"Found {len(raw_proxies)} potential proxies. Testing for connectivity...")
    
    # Increase trial limit to 40 since free proxies have high failure rate
    for proxy_url in raw_proxies[:40]:
        try:
            # Test against YouTube directly
            r = requests.head("http://www.youtube.com", proxies={"http": proxy_url, "https": proxy_url}, timeout=3)
            if r.status_code == 200:
                logger.info(f"Confirmed working proxy: {proxy_url}")
                return proxy_url
        except:
            continue
            
    logger.error("Exhausted proxy list without success.")
    return None

if __name__ == "__main__":
    p = get_working_proxy()
    print(f"Selected Proxy: {p}")
